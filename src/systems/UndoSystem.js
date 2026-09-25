// ============================================================
// UndoSystem.js
// 东线 1941 — 玩家行动撤销系统 V1.0
// ============================================================
export class UndoSystem {
    constructor({ maxHistory = 30 } = {}) {
        this.maxHistory = maxHistory;
        this.stack = [];
    }

    clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    capture({ units, turnSystem, gameOver = false }) {
        const state = turnSystem?.getState?.() ?? {};
        return {
            units: this.clone(units ?? []),
            turn: this.clone({
                ...state,
                turn: state.turn ?? turnSystem?.turn ?? 1,
                phase: state.phase ?? turnSystem?.phase ?? "german",
                year: state.year ?? turnSystem?.year ?? 1941,
                month: state.month ?? turnSystem?.month ?? 6,
                day: state.day ?? turnSystem?.day ?? 26,
                hour: state.hour ?? turnSystem?.hour ?? 8,
                minute: state.minute ?? turnSystem?.minute ?? 0
            }),
            gameOver
        };
    }

    push(state, label = "玩家行动") {
        this.stack.push({ label, snapshot: this.capture(state) });
        if (this.stack.length > this.maxHistory) this.stack.shift();
    }

    canUndo() {
        return this.stack.length > 0;
    }

    undo() {
        return this.stack.pop() ?? null;
    }

    discardLast() {
        if (this.stack.length > 0) this.stack.pop();
    }

    clear() {
        this.stack.length = 0;
    }
}
