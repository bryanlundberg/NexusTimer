import titlesCollection from "@/lib/titlesCollection";

export default function getTitleByPoints(points: number) {
  for (const current of titlesCollection) {
    if (points >= current.minPoints && points <= current.maxPoints) {
      return current.title;
    }
  }
  return titlesCollection[0].title;
}
