#!/usr/bin/env python3
"""
CLHMS Multi-Agent Orchestrator CLI
Allows sending tasks directly to specific Sub-Agents in isolated contexts to prevent chat/prompt overload.
"""

import sys
import json
import os
import argparse

CONFIG_PATH = os.path.join(os.path.dirname(__file__), "agents.config.json")

def load_config():
    if not os.path.exists(CONFIG_PATH):
        print(f"Error: Config file not found at {CONFIG_PATH}")
        sys.exit(1)
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def detect_agent(prompt: str, config: dict):
    prompt_lower = prompt.lower()
    
    # 1. Direct prefix detection: [UIX], [DB], [CORE], [AI], [DEVOPS] or @AgentName
    for agent_key, data in config["agents"].items():
        tag = f"[{data['tag'].lower()}]"
        alias = data["alias"].lower()
        if prompt_lower.startswith(tag) or prompt_lower.startswith(alias):
            # Clean prompt
            cleaned_prompt = prompt
            if prompt_lower.startswith(tag):
                cleaned_prompt = prompt[len(tag):].strip()
            elif prompt_lower.startswith(alias):
                cleaned_prompt = prompt[len(alias):].strip()
            return agent_key, data, cleaned_prompt

    # 2. Keyword heuristic matching
    scores = {}
    for agent_key, data in config["agents"].items():
        score = 0
        for kw in data.get("keywords", []):
            if kw in prompt_lower:
                score += 1
        scores[agent_key] = score

    best_match = max(scores, key=scores.get)
    if scores[best_match] > 0:
        return best_match, config["agents"][best_match], prompt

    # Default fallback to UIX
    return "UIX-Master-Agent", config["agents"]["UIX-Master-Agent"], prompt

def format_agent_envelope(agent_key: str, agent_data: dict, task: str):
    banner = f"""
================================================================================
🤖 ACTIVE SUB-AGENT: {agent_data['name']}
🏷️ TAG: [{agent_data['tag']}] | ALIAS: {agent_data['alias']}
📁 MANAGED PATHS: {', '.join(agent_data['managedPaths'])}
🎯 SPECIALIZATION: {agent_data['specialization']}
================================================================================
📜 ISOLATED SYSTEM PROMPT:
"{agent_data['systemPrompt']}"
================================================================================
📥 ISOLATED TASK PAYLOAD (NO OVERLOAD):
"{task}"
================================================================================
"""
    return banner

def main():
    parser = argparse.ArgumentParser(description="CLHMS Multi-Agent Orchestration Engine")
    parser.add_argument("task", nargs="*", help="Task to execute or pass to sub-agent")
    parser.add_argument("--agent", "-a", choices=["UIX", "DB", "CORE", "AI", "DEVOPS", "AUTO"], default="AUTO", help="Force specific agent")
    parser.add_argument("--list", "-l", action="store_true", help="List all registered sub-agents")
    parser.add_argument("--interactive", "-i", action="store_true", help="Run interactive multi-agent REPL")

    args = parser.parse_args()
    config = load_config()

    if args.list:
        print("\n🚀 REGISTERED CLHMS SUB-AGENTS (5 SPECIALIZED UNITS):")
        print("-" * 80)
        for key, info in config["agents"].items():
            print(f"[{info['tag']}] {info['alias']} -> {info['name']}")
            print(f"     Focus: {info['specialization']}")
            print(f"     Paths: {', '.join(info['managedPaths'])}\n")
        return

    if args.interactive:
        print("\n🎛️  CLHMS MULTI-AGENT INTERACTIVE CONSOLE")
        print("💡 Talo: Ku bilow weedhaada [UIX], [DB], [CORE], [AI], ama [DEVOPS] si aad toos ugu dhiibto agent-kaas.")
        print("💡 Qor 'exit' ama 'quit' si aad uga baxdo.\n")

        while True:
            try:
                user_input = input("CLHMS-Orchestrator > ").strip()
                if not user_input:
                    continue
                if user_input.lower() in ["exit", "quit", "q"]:
                    print("Exiting orchestrator. Nabadgelyo!")
                    break

                agent_key, agent_data, clean_task = detect_agent(user_input, config)
                print(format_agent_envelope(agent_key, agent_data, clean_task))
            except (KeyboardInterrupt, EOFError):
                print("\nExiting orchestrator.")
                break
        return

    full_task = " ".join(args.task).strip()
    if not full_task:
        print("Fadlan geli hawsha aad rabto inaad u dhiibto Sub-Agent-ka.")
        print("Tusaale: python3 orchestrator/run.py '[UIX] Samee Navigation Bar'")
        print("ama:     python3 orchestrator/run.py --agent DB 'Qor migration table cusub'")
        sys.exit(1)

    if args.agent != "AUTO":
        tag_map = {data["tag"]: key for key, data in config["agents"].items()}
        selected_key = tag_map.get(args.agent)
        if selected_key:
            agent_data = config["agents"][selected_key]
            print(format_agent_envelope(selected_key, agent_data, full_task))
            return

    agent_key, agent_data, clean_task = detect_agent(full_task, config)
    print(format_agent_envelope(agent_key, agent_data, clean_task))

if __name__ == "__main__":
    main()
