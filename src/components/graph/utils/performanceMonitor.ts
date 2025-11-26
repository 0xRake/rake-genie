// Performance Monitoring Utilities

class PerformanceMonitor {
  private physicsTimes: number[] = [];
  private renderTimes: number[] = [];
  private maxSamples = 100;
  private lastFrameTime = 0;
  private frameCount = 0;
  private fps = 60;

  recordPhysicsTime(time: number) {
    this.physicsTimes.push(time);
    if (this.physicsTimes.length > this.maxSamples) {
      this.physicsTimes.shift();
    }
  }

  recordRenderTime(time: number) {
    this.renderTimes.push(time);
    if (this.renderTimes.length > this.maxSamples) {
      this.renderTimes.shift();
    }
  }

  updateFPS() {
    const now = performance.now();
    this.frameCount++;
    if (now - this.lastFrameTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastFrameTime = now;
    }
  }

  checkPerformance(nodeCount: number, linkCount: number) {
    const avgPhysics = this.getAveragePhysicsTime();
    if (avgPhysics > 16.67) { // > 60fps threshold
      console.warn(`Performance warning: Physics time ${avgPhysics.toFixed(2)}ms for ${nodeCount} nodes, ${linkCount} links`);
    }
  }

  getAveragePhysicsTime(): number {
    if (this.physicsTimes.length === 0) return 0;
    return this.physicsTimes.reduce((a, b) => a + b, 0) / this.physicsTimes.length;
  }

  getAverageRenderTime(): number {
    if (this.renderTimes.length === 0) return 0;
    return this.renderTimes.reduce((a, b) => a + b, 0) / this.renderTimes.length;
  }

  getFPS(): number {
    return this.fps;
  }

  reset() {
    this.physicsTimes = [];
    this.renderTimes = [];
    this.frameCount = 0;
    this.lastFrameTime = performance.now();
  }
}

export const performanceMonitor = new PerformanceMonitor();

