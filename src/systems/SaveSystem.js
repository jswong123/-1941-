// ============================================================
// SaveSystem.js
// 东线 1941 — 本地存档系统 V1.0
// ============================================================
export class SaveSystem {
    constructor({ storagePrefix = "eastern_front_1941", maxSlots = 6 } = {}) {
        this.storagePrefix = storagePrefix;
        this.maxSlots = maxSlots;
    }

    key(slot) {
        return `${this.storagePrefix}_save_${slot}`;
    }

    clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    buildSnapshot({ units, turnSystem, gameState, gameOver = false, scenario = null }) {
        const state = turnSystem?.getState?.() ?? {};
        const turn = {
            ...state,
            turn: state.turn ?? turnSystem?.turn ?? 1,
            phase: state.phase ?? turnSystem?.phase ?? "german",
            year: state.year ?? turnSystem?.year ?? 1941,
            month: state.month ?? turnSystem?.month ?? 6,
            day: state.day ?? turnSystem?.day ?? 26,
            hour: state.hour ?? turnSystem?.hour ?? 8,
            minute: state.minute ?? turnSystem?.minute ?? 0
        };
        return {
            version: 1,
            savedAt: new Date().toISOString(),
            scenario: scenario?.id ?? scenario?.name ?? "Dubno 1941",
            gameOver,
            playerFaction: gameState?.playerFaction ?? gameState?.playerSide ?? null,
            mode: gameState?.mode ?? "player",
            turn: this.clone(turn),
            units: this.clone(units ?? [])
        };
    }

    save(slot, state) {
        if (!Number.isInteger(slot) || slot < 0 || slot > this.maxSlots) {
            throw new Error("无效存档槽位");
        }
        const snapshot = this.buildSnapshot(state);
        localStorage.setItem(this.key(slot), JSON.stringify(snapshot));
        return snapshot;
    }

    load(slot) {
        const raw = localStorage.getItem(this.key(slot));
        if (!raw) return null;
        try {
            const data = JSON.parse(raw);
            if (!data || !Array.isArray(data.units)) throw new Error("存档数据损坏");
            return data;
        } catch (error) {
            console.error(`[存档] 槽位 ${slot} 读取失败`, error);
            return null;
        }
    }

    has(slot) {
        return localStorage.getItem(this.key(slot)) != null;
    }

    remove(slot) {
        localStorage.removeItem(this.key(slot));
    }

    list() {
        const result = [];
        for (let slot = 0; slot <= this.maxSlots; slot++) {
            const data = this.load(slot);
            if (data) result.push({ slot, savedAt: data.savedAt, scenario: data.scenario, turn: data.turn?.turn ?? 1, phase: data.turn?.phase ?? "german" });
        }
        return result;
    }

    autoSave(state) {
        return this.save(0, state);
    }
}


