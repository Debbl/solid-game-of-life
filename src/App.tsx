import {
  createSignal,
  type Component,
  Index,
  onMount,
  onCleanup,
} from "solid-js";
import { getAdjoinCount } from "./utils";
import patterns from "./assets/patterns.json";

const SIZE = 16;

export type TBoard = (0 | 1)[];

const App: Component = () => {
  let intervalID: number;
  const [board, setBoard] = createSignal<TBoard>(
    patterns["16"]["00"] as TBoard
  );
  const [isStarting, setIsStarting] = createSignal<boolean>(true);

  const nextBoard = () => {
    const next = [...board()];
    board().forEach((_, i) => {
      const adjoinCount = getAdjoinCount(i, board(), SIZE);
      if (next[i] === 1 && (adjoinCount < 2 || adjoinCount > 3)) {
        next[i] = 0;
      } else if (next[i] === 0 && adjoinCount === 3) {
        next[i] = 1;
      }
    });
    setBoard(next);
  };

  const handleCellClick = (index: number) => {
    const next = [...board()];
    next[index] = next[index] === 1 ? 0 : 1;
    setBoard(next);
  };
  const handleStart = () => {
    setIsStarting(true);
    intervalID = setInterval(nextBoard, 300);
  };
  const handleStop = () => {
    setIsStarting(false);
    intervalID && clearInterval(intervalID);
  };

  onMount(() => {
    if (!isStarting()) return;
    intervalID = setInterval(nextBoard, 300);
    onCleanup(() => intervalID && clearInterval(intervalID));
  });

  return (
    <div>
      <div>
        <button
          class="btn"
          onClick={() => (isStarting() ? handleStop() : handleStart())}
        >
          {isStarting() ? "stop" : "start"}
        </button>
        <button class="btn" onClick={() => nextBoard()}>
          next
        </button>
      </div>
      <div class="flex w-[32rem] flex-wrap mx-auto">
        <Index each={board()} fallback={<div>loading...</div>}>
          {(cell, index) => (
            <div class="flex">
              <button
                class={`border w-8 h-8 ${cell() === 1 ? "bg-black" : ""}`}
                onClick={() => handleCellClick(index)}
              ></button>
            </div>
          )}
        </Index>
      </div>
    </div>
  );
};

export default App;
