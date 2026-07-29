import {
  getDelayedTrains,
  formatDelayReport,
  updateDelay,
  getDelaySummary,
  getFirstTrainName,
  completeOrder,
  getPendingOrders,
  formatOrderSummary,
  sampleToppingStock,
} from "./solution";

const trains = [
  { name: "のぞみ1号", speed: 300, delayMinutes: 0 },
  { name: "ひかり5号", speed: 250, delayMinutes: 3 },
  { name: "こだま2号", speed: 130, delayMinutes: 0 },
  { name: "はやぶさ7号", speed: 320, delayMinutes: 8 },
];

describe("Part A: 電車の運行管理", () => {
  test("getDelayedTrains: 遅延してる電車だけを返す", () => {
    const result = getDelayedTrains(trains);
    expect(result.map((t) => t.name)).toEqual(["ひかり5号", "はやぶさ7号"]);
  });

  test("formatDelayReport: 遅延ありの場合", () => {
    expect(formatDelayReport({ name: "のぞみ1号", speed: 300, delayMinutes: 3 })).toBe(
      "のぞみ1号:3分遅延",
    );
  });

  test("formatDelayReport: 遅延なしの場合", () => {
    expect(formatDelayReport({ name: "のぞみ1号", speed: 300, delayMinutes: 0 })).toBe(
      "のぞみ1号:定刻",
    );
  });

  test("updateDelay: delayMinutesを更新した新しいオブジェクトを返し、元は変更しない", () => {
    const train = { name: "ひかり5号", speed: 250, delayMinutes: 3 };
    const result = updateDelay(train, 10);

    expect(result).toEqual({ name: "ひかり5号", speed: 250, delayMinutes: 10 });
    expect(train.delayMinutes).toBe(3);
    expect(result).not.toBe(train);
  });

  test("getDelaySummary: 遅延してる電車だけの文字列配列を返す", () => {
    expect(getDelaySummary(trains)).toEqual(["ひかり5号:3分遅延", "はやぶさ7号:8分遅延"]);
  });

  test("getFirstTrainName: 通常のケース", () => {
    expect(getFirstTrainName(trains)).toBe("のぞみ1号");
  });

  test("getFirstTrainName: undefinedの場合は該当なし", () => {
    expect(getFirstTrainName(undefined)).toBe("該当なし");
  });

  test("getFirstTrainName: 空配列の場合は該当なし", () => {
    expect(getFirstTrainName([])).toBe("該当なし");
  });
});

describe("Part B: ケーキの注文管理", () => {
  test("completeOrder: isCompletedをtrueにした新しいオブジェクトを返し、元は変更しない", () => {
    const order = {
      customerName: "のりまき",
      cakeKind: "shortcake" as const,
      isCompleted: false,
    };
    const result = completeOrder(order);

    expect(result.isCompleted).toBe(true);
    expect(order.isCompleted).toBe(false);
    expect(result).not.toBe(order);
  });

  test("getPendingOrders: isCompletedがfalseの注文だけを返す", () => {
    const orders = [
      { customerName: "A", cakeKind: "shortcake" as const, isCompleted: true },
      { customerName: "B", cakeKind: "chocolate" as const, isCompleted: false },
      { customerName: "C", cakeKind: "shortcake" as const, isCompleted: false },
    ];

    expect(getPendingOrders(orders).map((o) => o.customerName)).toEqual(["B", "C"]);
  });

  test("formatOrderSummary: トッピングありの場合", () => {
    const summary = formatOrderSummary({
      customerName: "のりまき",
      cakeKind: "shortcake",
      toppings: ["いちご", "生クリーム"],
      isCompleted: false,
    });

    expect(summary).toBe("のりまきさん:ショートケーキ(トッピング:いちご、生クリーム)");
  });

  test("formatOrderSummary: トッピングなしの場合", () => {
    const summary = formatOrderSummary({
      customerName: "のりまき",
      cakeKind: "shortcake",
      isCompleted: false,
    });

    expect(summary).toBe("のりまきさん:ショートケーキ");
  });

  test("formatOrderSummary: chocolateはチョコケーキと表示される", () => {
    const summary = formatOrderSummary({
      customerName: "しばまき",
      cakeKind: "chocolate",
      isCompleted: false,
    });

    expect(summary).toBe("しばまきさん:チョコケーキ");
  });

  test("sampleToppingStock: 3種類すべてのキーがnumber", () => {
    expect(typeof sampleToppingStock.strawberry).toBe("number");
    expect(typeof sampleToppingStock.cream).toBe("number");
    expect(typeof sampleToppingStock.banana).toBe("number");
  });
});
