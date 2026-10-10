import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import org.worldcubeassociation.tnoodle.puzzle.ClockPuzzle;
import org.worldcubeassociation.tnoodle.puzzle.CubePuzzle;
import org.worldcubeassociation.tnoodle.puzzle.FaceTurningOctahedronPuzzle;
import org.worldcubeassociation.tnoodle.puzzle.FourByFourCubePuzzle;
import org.worldcubeassociation.tnoodle.puzzle.MegaminxPuzzle;
import org.worldcubeassociation.tnoodle.puzzle.NoInspectionFourByFourCubePuzzle;
import org.worldcubeassociation.tnoodle.puzzle.NoInspectionThreeByThreeCubePuzzle;
import org.worldcubeassociation.tnoodle.puzzle.PyraminxPuzzle;
import org.worldcubeassociation.tnoodle.puzzle.SkewbPuzzle;
import org.worldcubeassociation.tnoodle.puzzle.SquareOnePuzzle;
import org.worldcubeassociation.tnoodle.puzzle.ThreeByThreeCubePuzzle;
import org.worldcubeassociation.tnoodle.puzzle.TwoByTwoCubePuzzle;
import org.worldcubeassociation.tnoodle.scrambles.InvalidScrambleException;
import org.worldcubeassociation.tnoodle.scrambles.Puzzle;

public class Validate {
    public static void main(String[] args) throws Exception {
        Path dir = Path.of(args[0]);
        int samples = args.length > 1 ? Integer.parseInt(args[1]) : 0;
        boolean ok = true;
        List<Path> files;
        try (var stream = Files.list(dir)) {
            files = stream.filter(p -> p.toString().endsWith(".txt")).sorted().toList();
        }
        for (Path file : files) {
            String key = file.getFileName().toString().replace(".txt", "");
            Puzzle puzzle = create(key);
            int min = puzzle.getWcaMinScrambleDistance();
            List<String> scrambles = Files.readAllLines(file).stream().filter(s -> !s.isBlank()).toList();
            int invalid = 0;
            int tooClose = 0;
            int wrongState = 0;
            int checkedStates = 0;
            Map<Integer, Integer> ours = new TreeMap<>();
            for (String line : scrambles) {
                String[] parts = line.split("\t");
                String scramble = parts[0];
                Puzzle.PuzzleState state;
                try {
                    state = puzzle.getSolvedState().applyAlgorithm(scramble);
                } catch (InvalidScrambleException e) {
                    if (invalid++ < 3) {
                        System.out.println("  invalid: " + scramble + " (" + e.getMessage() + ")");
                    }
                    continue;
                }
                if (parts.length > 1) {
                    checkedStates++;
                    String actual = describe(key, puzzle, scramble, state);
                    if (!parts[1].equals(actual)) {
                        if (wrongState++ < 3) {
                            System.out.println("  state " + parts[1] + " but tnoodle reaches " + actual + ": " + scramble);
                        }
                    }
                }
                if (state.solveIn(min - 1) != null) {
                    if (tooClose++ < 3) {
                        System.out.println("  under min distance: " + scramble);
                    }
                }
                ours.merge(length(scramble), 1, Integer::sum);
            }
            Map<Integer, Integer> theirs = new TreeMap<>();
            for (int i = 0; i < samples; i++) {
                theirs.merge(length(puzzle.generateScramble()), 1, Integer::sum);
            }
            System.out.printf("%-6s %4d scrambles, invalid %d, under min distance %d (min %d), states checked %d, wrong %d%n",
                    key, scrambles.size(), invalid, tooClose, min, checkedStates, wrongState);
            System.out.println("  lengths ours    " + ours);
            if (samples > 0) {
                System.out.println("  lengths tnoodle " + theirs);
            }
            ok &= invalid == 0 && tooClose == 0 && wrongState == 0;
        }
        System.exit(ok ? 0 : 1);
    }

    static String describe(String key, Puzzle puzzle, String scramble, Puzzle.PuzzleState state) throws Exception {
        if (state instanceof PyraminxPuzzle.PyraminxState pyraminx) {
            var s = pyraminx.toPyraminxSolverState();
            return s.edgePerm + "," + s.edgeOrient + "," + s.cornerOrient + "," + s.tips;
        }
        if (state instanceof SkewbPuzzle.SkewbState skewb) {
            var s = skewb.toSkewbSolverState();
            return s.perm + "," + s.twst;
        }
        if (key.equals("sq1")) {
            var method = state.getClass().getDeclaredMethod("toFullCube");
            method.setAccessible(true);
            Object full = method.invoke(state);
            return String.format("%06x,%06x,%06x,%06x,%d", field(full, "ul"), field(full, "ur"), field(full, "dl"),
                    field(full, "dr"), field(full, "ml"));
        }
        if (key.equals("fto")) {
            var fto = new levigibson.fto3phase.FtoCubie();
            for (String token : scramble.trim().split("\s+")) {
                fto.turn(FTO_MOVES.indexOf(token));
            }
            return String.join(",", join(fto.getCornerPerm()), join(fto.getCornerOri()), join(fto.getEdges()),
                    join(fto.getTrianglesUFBrBl()), join(fto.getTrianglesRLBD()));
        }
        if (key.equals("222")) {
            var s = ((CubePuzzle.CubeState) state).toTwoByTwoState();
            return s.permutation + "," + s.orientation;
        }
        if (key.equals("333")) {
            return ((CubePuzzle.CubeState) state).toFaceCube();
        }
        if (key.equals("333ni")) {
            String faceTurns = String.join(" ", java.util.Arrays.stream(scramble.trim().split("\s+"))
                    .filter(token -> !token.contains("w")).toList());
            return ((CubePuzzle.CubeState) puzzle.getSolvedState().applyAlgorithm(faceTurns)).toFaceCube();
        }
        return null;
    }

    static final List<String> FTO_MOVES =
            List.of("R", "R'", "L", "L'", "B", "B'", "U", "U'", "D", "D'", "F", "F'", "BR", "BR'", "BL", "BL'");

    static String join(int[] values) {
        return String.join(" ", java.util.Arrays.stream(values).mapToObj(Integer::toString).toList());
    }

    static int field(Object target, String name) throws Exception {
        var f = target.getClass().getDeclaredField(name);
        f.setAccessible(true);
        return f.getInt(target);
    }

    static int length(String scramble) {
        return scramble.trim().split("\\s+").length;
    }

    static Puzzle create(String key) {
        switch (key) {
            case "222": return new TwoByTwoCubePuzzle();
            case "333": return new ThreeByThreeCubePuzzle();
            case "333ni": return new NoInspectionThreeByThreeCubePuzzle();
            case "444": return new FourByFourCubePuzzle();
            case "444ni": return new NoInspectionFourByFourCubePuzzle();
            case "555": return new CubePuzzle(5);
            case "666": return new CubePuzzle(6);
            case "777": return new CubePuzzle(7);
            case "pyram": return new PyraminxPuzzle();
            case "sq1": return new SquareOnePuzzle();
            case "minx": return new MegaminxPuzzle();
            case "clock": return new ClockPuzzle();
            case "skewb": return new SkewbPuzzle();
            case "fto": return new FaceTurningOctahedronPuzzle();
            default: throw new IllegalArgumentException("Unknown puzzle: " + key);
        }
    }
}
