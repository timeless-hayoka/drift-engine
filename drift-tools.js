const { execSync } = require('child_process');

const tools = {
  crex_search: {
    name: "crex_search",
    description: "Search the 165-skill arsenal for relevant security techniques and knowledge.",
    parameters: {
      type: "OBJECT",
      properties: {
        query: {
          type: "STRING",
          description: "The search term or concept to find in the skill tree."
        }
      },
      required: ["query"]
    },
    execute: (args) => {
      console.log(`[*] Executing crex:search '${args.query}'...`);
      return execSync(`python3 /home/crex/.antigravity/extensions/crex/bin/crex_wrapper.py search '${args.query}' 2>&1`).toString();
    }
  },
  crex_show: {
    name: "crex_show",
    description: "Retrieve the full documentation and tactical commands for a specific skill.",
    parameters: {
      type: "OBJECT",
      properties: {
        skill: {
          type: "STRING",
          description: "The name of the skill (e.g., 'nmap-advanced-scanning')."
        }
      },
      required: ["skill"]
    },
    execute: (args) => {
      console.log(`[*] Executing crex:show ${args.skill}...`);
      return execSync(`python3 /home/crex/.antigravity/extensions/crex/bin/crex_wrapper.py show ${args.skill} 2>&1`).toString();
    }
  },
  nmap_scan: {
    name: "nmap_scan",
    description: "Execute an Nmap network scan. Use for reconnaissance and vulnerability identification.",
    parameters: {
      type: "OBJECT",
      properties: {
        target: {
          type: "STRING",
          description: "The target IP address or domain."
        },
        options: {
          type: "STRING",
          description: "Additional Nmap flags (e.g., '-sV -T4'). Defaults to '-sS -T4'."
        }
      },
      required: ["target"]
    },
    execute: (args) => {
      const options = args.options || "-sS -T4";
      console.log(`[*] Executing nmap ${options} ${args.target}...`);
      // Use sudo as authorized in GEMINI.md
      return execSync(`sudo nmap ${options} ${args.target} 2>&1`).toString();
    }
  },
  adb_command: {
    name: "adb_command",
    description: "Execute an ADB shell command on the Samsung Flipper node.",
    parameters: {
      type: "OBJECT",
      properties: {
        command: {
          type: "STRING",
          description: "The shell command to run on the Android node."
        }
      },
      required: ["command"]
    },
    execute: (args) => {
      console.log(`[*] Executing adb shell "${args.command}"...`);
      return execSync(`adb shell "${args.command}" 2>&1`).toString();
    }
  },
  dolphin_query: {
    name: "dolphin_query",
    description: "Query the local Dolphin-Llama3 model for unrestricted reasoning, planning, or complex security analysis.",
    parameters: {
      type: "OBJECT",
      properties: {
        prompt: {
          type: "STRING",
          description: "The specific prompt or mission description for the local model."
        }
      },
      required: ["prompt"]
    },
    execute: (args) => {
      console.log(`[*] Querying local Dolphin intelligence...`);
      // Using the dolphin CLI command
      return execSync(`dolphin "${args.prompt}" 2>&1`).toString();
    }
  },
  apex_mothership_execute: {
    name: "apex_mothership_execute",
    description: "Execute security tools or custom shadow scripts via the Apex Mothership command center.",
    parameters: {
      type: "OBJECT",
      properties: {
        tool: {
          type: "STRING",
          description: "The tool name (nmap, ufonet, nuclei, sherlock, john) or the full path to a custom shadow script."
        },
        target: {
          type: "STRING",
          description: "The target domain, IP, or path for the tool/script."
        },
        args: {
          type: "STRING",
          description: "Additional arguments or flags for the execution."
        }
      },
      required: ["tool", "target"]
    },
    execute: async (args) => {
      console.log(`[*] Sending mission to Apex Mothership: ${args.tool} on ${args.target}...`);
      try {
        const response = await fetch('http://localhost:8000/scan/execute', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({tool: args.tool, target: args.target, args: args.args || ""})
        });
        const data = await response.json();
        return data.summary;
      } catch (error) {
        return `Error connecting to Apex Mothership: ${error.message}`;
      }
    }
  },
  apex_mothership_list_scripts: {
    name: "apex_mothership_list_scripts",
    description: "List all custom hacking scripts (shadow scripts) available in the Apex Mothership arsenal.",
    parameters: {
      type: "OBJECT",
      properties: {}
    },
    execute: async () => {
      console.log(`[*] Querying Apex Mothership for shadow scripts...`);
      try {
        const response = await fetch('http://localhost:8000/');
        const html = await response.text();
        // The script list is embedded in the HTML script tag
        const match = html.match(/const shadowScripts = (\[.*?\]);/s);
        if (match) {
          return match[1];
        }
        return "No scripts found or error parsing dashboard.";
      } catch (error) {
        return `Error connecting to Apex Mothership: ${error.message}`;
      }
    }
  }
};

module.exports = { tools };
