import cubeSolver from "cube-solver";

self.onmessage = async (event) => {
  const { type } = event.data;
  try {
    await cubeSolver.initialize(type);
    self.postMessage({ success: true });
  } catch (error) {
    self.postMessage({ success: false, error: error.message });
  }
};
