const fs = require('fs');
const path = require('path');

const memoryPath = path.join(__dirname, 'missions.json');

const memory = {
  load: () => {
    if (fs.existsSync(memoryPath)) {
      return JSON.parse(fs.readFileSync(memoryPath));
    }
    return { missions: [] };
  },
  save: (mission) => {
    const data = memory.load();
    data.missions.push({
      timestamp: new Date().toISOString(),
      ...mission
    });
    fs.writeFileSync(memoryPath, JSON.stringify(data, null, 2));
  },
  getRecentContext: (limit = 5) => {
    const data = memory.load();
    return data.missions.slice(-limit).map(m => `Mission: ${m.goal}\nOutcome: ${m.outcome}`).join('\n\n');
  }
};

module.exports = { memory };
