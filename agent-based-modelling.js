class Random {
  constructor(seed = 12345) {
    this.seed = seed >>> 0;
  }

  next() {
    this.seed = (1664525 * this.seed + 1013904223) >>> 0;
    return this.seed / 0x100000000;
  }

  int(max) {
    return Math.floor(this.next() * max);
  }
}

class Agent {
  constructor(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
  }
}

class World {
  constructor({ width = 10, height = 10, agentCount = 5, seed = 12345 } = {}) {
    this.width = width;
    this.height = height;
    this.random = new Random(seed);
    this.agents = Array.from({ length: agentCount }, (_, index) =>
      new Agent(index + 1, this.random.int(width), this.random.int(height)),
    );
  }

  step() {
    for (const agent of this.agents) {
      agent.x = this.#clamp(agent.x + this.random.int(3) - 1, 0, this.width - 1);
      agent.y = this.#clamp(agent.y + this.random.int(3) - 1, 0, this.height - 1);
    }

    return this.snapshot();
  }

  snapshot() {
    return this.agents.map((agent) => ({
      id: agent.id,
      x: agent.x,
      y: agent.y,
    }));
  }

  #clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
}

function simulate(options = {}) {
  const { steps = 5, ...worldOptions } = options;
  const world = new World(worldOptions);
  const history = [world.snapshot()];

  for (let step = 0; step < steps; step += 1) {
    history.push(world.step());
  }

  return {
    config: {
      width: world.width,
      height: world.height,
      agentCount: world.agents.length,
      steps,
    },
    history,
  };
}

if (require.main === module) {
  const result = simulate();
  console.log(JSON.stringify(result, null, 2));
}

module.exports = {
  Agent,
  World,
  simulate,
};
