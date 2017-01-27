/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */
"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var augur = require("../../../src");
var constants = require("../../../src/constants");
var utils = require("../../../src/utilities");

describe("tradeActions.calculateBuyTradeIDs", function() {
    // 3 tests total
    var filterByPriceAndOutcomeAndUserSortByPrice = augur.filterByPriceAndOutcomeAndUserSortByPrice;
    afterEach(function() {
        augur.filterByPriceAndOutcomeAndUserSortByPrice = filterByPriceAndOutcomeAndUserSortByPrice;
    });
    var test = function(t) {
        it(t.description, function() {
            augur.filterByPriceAndOutcomeAndUserSortByPrice = t.filterByPriceAndOutcomeAndUserSortByPrice;
            t.assertions(augur.calculateBuyTradeIDs(t.marketID, t.outcomeID, t.limitPrice, t.orderBooks, t.address));
        });
    };
    test({
        description: 'Should handle returning the matching sell trades',
        marketID: '0xa1',
        outcomeID: '1',
        limitPrice: '0.5',
        orderBooks: {
        	'0xa1': {
        		buy: {},
        		sell: {
                    '0xb1': { amount: '10', price: '0.5', outcome: '1', owner: '0x2', id: '0xb1'},
                    '0xb2': { amount: '20', price: '0.4', outcome: '1', owner: '0x2', id: '0xb2'},
                    '0xb3': { amount: '30', price: '0.6', outcome: '1', owner: '0x2', id: '0xb3'},
                    '0xb4': { amount: '40', price: '0.45', outcome: '1', owner: '0x2', id: '0xb4'},
        		}
        	}
        },
        address: '0x1',
        filterByPriceAndOutcomeAndUserSortByPrice: function(orders, traderOrderType, limitPrice, outcomeId, userAddress) {
            assert.deepEqual(orders, {
                '0xb1': { amount: '10', price: '0.5', outcome: '1', owner: '0x2', id: '0xb1'},
                '0xb2': { amount: '20', price: '0.4', outcome: '1', owner: '0x2', id: '0xb2'},
                '0xb3': { amount: '30', price: '0.6', outcome: '1', owner: '0x2', id: '0xb3'},
                '0xb4': { amount: '40', price: '0.45', outcome: '1', owner: '0x2', id: '0xb4'},
            });
            assert.equal(limitPrice, '0.5');
            assert.equal(outcomeId, '1');
            assert.equal(userAddress, '0x1');
            // mock how filterByPriceAndOutcomeAndUserSortByPrice works
            // simply return what it would return in this situation...
            return [{
            	amount: '20',
            	price: '0.4',
            	outcome: '1',
            	owner: '0x2',
            	id: '0xb2'
            }, {
            	amount: '40',
            	price: '0.45',
            	outcome: '1',
            	owner: '0x2',
            	id: '0xb4'
            }, {
            	amount: '10',
            	price: '0.5',
            	outcome: '1',
            	owner: '0x2',
            	id: '0xb1'
            }];
        },
        assertions(output) {
            assert.deepEqual(output, ['0xb2', '0xb4', '0xb1']);
        }
    });
    test({
        description: 'Should handle an orderbook without the passed market',
        marketID: '0xa1',
        outcomeID: '1',
        limitPrice: '0.5',
        orderBooks: {
        	'0xa4': {
        		buy: {},
        		sell: {
                    '0xb1': { amount: '10', price: '0.5', outcome: '1', owner: '0x2', id: '0xb1'},
                    '0xb2': { amount: '20', price: '0.4', outcome: '1', owner: '0x2', id: '0xb2'},
                    '0xb3': { amount: '30', price: '0.6', outcome: '1', owner: '0x2', id: '0xb3'},
                    '0xb4': { amount: '40', price: '0.45', outcome: '1', owner: '0x2', id: '0xb4'},
        		}
        	}
        },
        address: '0x1',
        filterByPriceAndOutcomeAndUserSortByPrice: function(orders, traderOrderType, limitPrice, outcomeId, userAddress) {
            assert.deepEqual(orders, {});
            assert.equal(limitPrice, '0.5');
            assert.equal(outcomeId, '1');
            assert.equal(userAddress, '0x1');
            // mock how filterByPriceAndOutcomeAndUserSortByPrice works
            // simply return what it would return in this situation...
            return [];
        },
        assertions(output) {
            assert.deepEqual(output, []);
        }
    });
    test({
        description: 'Should handle an empty orderBook',
        marketID: '0xa1',
        outcomeID: '2',
        limitPrice: '0.7',
        orderBooks: {},
        address: '0x1',
        filterByPriceAndOutcomeAndUserSortByPrice: function(orders, traderOrderType, limitPrice, outcomeId, userAddress) {
            assert.deepEqual(orders, {});
            assert.equal(limitPrice, '0.7');
            assert.equal(outcomeId, '2');
            assert.equal(userAddress, '0x1');
            // mock how filterByPriceAndOutcomeAndUserSortByPrice works
            // simply return what it would return in this situation...
            return [];
        },
        assertions(output) {
            assert.deepEqual(output, []);
        }
    });
});

describe("tradeActions.calculateSellTradeIDs", function() {
    // 3 tests total
    var filterByPriceAndOutcomeAndUserSortByPrice = augur.filterByPriceAndOutcomeAndUserSortByPrice;
    afterEach(function() {
        augur.filterByPriceAndOutcomeAndUserSortByPrice = filterByPriceAndOutcomeAndUserSortByPrice;
    });
    var test = function(t) {
        it(t.description, function() {
            augur.filterByPriceAndOutcomeAndUserSortByPrice = t.filterByPriceAndOutcomeAndUserSortByPrice;
            t.assertions(augur.calculateSellTradeIDs(t.marketID, t.outcomeID, t.limitPrice, t.orderBooks, t.address));
        });
    };
    test({
        description: 'Should handle returning the matching buy trades',
        marketID: '0xa1',
        outcomeID: '1',
        limitPrice: '0.5',
        orderBooks: {
            '0xa1': {
                buy: {
                    '0xb1': { amount: '10', price: '0.5', outcome: '1', owner: '0x2', id: '0xb1'},
                    '0xb2': { amount: '20', price: '0.7', outcome: '1', owner: '0x2', id: '0xb2'},
                    '0xb3': { amount: '30', price: '0.6', outcome: '1', owner: '0x2', id: '0xb3'},
                    '0xb4': { amount: '40', price: '0.45', outcome: '1', owner: '0x2', id: '0xb4'},
                },
                sell: {}
            }
        },
        address: '0x1',
        filterByPriceAndOutcomeAndUserSortByPrice: function(orders, traderOrderType, limitPrice, outcomeId, userAddress) {
            assert.deepEqual(orders, {
                '0xb1': { amount: '10', price: '0.5', outcome: '1', owner: '0x2', id: '0xb1'},
                '0xb2': { amount: '20', price: '0.7', outcome: '1', owner: '0x2', id: '0xb2'},
                '0xb3': { amount: '30', price: '0.6', outcome: '1', owner: '0x2', id: '0xb3'},
                '0xb4': { amount: '40', price: '0.45', outcome: '1', owner: '0x2', id: '0xb4'},
            });
            assert.equal(limitPrice, '0.5');
            assert.equal(outcomeId, '1');
            assert.equal(userAddress, '0x1');
            // mock how filterByPriceAndOutcomeAndUserSortByPrice works
            // simply return what it would return in this situation...
            return [
                { amount: '20', price: '0.7', outcome: '1', owner: '0x2', id: '0xb2'},
                { amount: '30', price: '0.6', outcome: '1', owner: '0x2', id: '0xb3'},
                { amount: '10', price: '0.5', outcome: '1', owner: '0x2', id: '0xb1'}
            ];
        },
        assertions(output) {
            assert.deepEqual(output, ['0xb2', '0xb3', '0xb1']);
        }
    });
    test({
        description: 'Should handle an orderbook without the passed market',
        marketID: '0xa1',
        outcomeID: '1',
        limitPrice: '0.5',
        orderBooks: {
            '0xa4': {
                buy: {
                    '0xb1': { amount: '10', price: '0.5', outcome: '1', owner: '0x2', id: '0xb1'},
                    '0xb2': { amount: '20', price: '0.7', outcome: '1', owner: '0x2', id: '0xb2'},
                    '0xb3': { amount: '30', price: '0.6', outcome: '1', owner: '0x2', id: '0xb3'},
                    '0xb4': { amount: '40', price: '0.45', outcome: '1', owner: '0x2', id: '0xb4'},
                },
                sell: {}
            }
        },
        address: '0x1',
        filterByPriceAndOutcomeAndUserSortByPrice: function(orders, traderOrderType, limitPrice, outcomeId, userAddress) {
            assert.deepEqual(orders, {});
            assert.equal(limitPrice, '0.5');
            assert.equal(outcomeId, '1');
            assert.equal(userAddress, '0x1');
            // mock how filterByPriceAndOutcomeAndUserSortByPrice works
            // simply return what it would return in this situation...
            return [];
        },
        assertions(output) {
            assert.deepEqual(output, []);
        }
    });
    test({
        description: 'Should handle an empty orderBook',
        marketID: '0xa1',
        outcomeID: '2',
        limitPrice: '0.7',
        orderBooks: {},
        address: '0x1',
        filterByPriceAndOutcomeAndUserSortByPrice: function(orders, traderOrderType, limitPrice, outcomeId, userAddress) {
            assert.deepEqual(orders, {});
            assert.equal(limitPrice, '0.7');
            assert.equal(outcomeId, '2');
            assert.equal(userAddress, '0x1');
            // mock how filterByPriceAndOutcomeAndUserSortByPrice works
            // simply return what it would return in this situation...
            return [];
        },
        assertions(output) {
            assert.deepEqual(output, []);
        }
    });
});

describe("tradeActions.getTxGasEth", function() {});
describe("tradeActions.filterByPriceAndOutcomeAndUserSortByPrice", function() {});
describe("tradeActions.getBidAction", function() {});
describe("tradeActions.getBuyAction", function() {});
describe("tradeActions.getAskAction", function() {});
describe("tradeActions.getSellAction", function() {});
describe("tradeActions.getShortSellAction", function() {});
describe("tradeActions.getShortAskAction", function() {});
describe("tradeActions.calculateTradeTotals", function() {});

describe("getTradingActions", function () {

  var testFields = [
    "action",
    "shares",
    "feeEth",
    "costEth",
    "avgPrice",
    "feePercent",
    "noFeePrice"
  ];

  function testTradeActions(actions, expected) {
    for (var i = 0; i < expected.length; ++i) {
      for (var j = 0; j < testFields.length; ++j) {
        assert.strictEqual(actions[i][testFields[j]], expected[i][testFields[j]]);
      }
    }
  }

  function runTestCase(testCase) {
    it(testCase.description, function () {
      var actions = augur.getTradingActions({
        type: testCase.type,
        orderShares: testCase.orderShares,
        orderLimitPrice: testCase.orderLimitPrice,
        takerFee: testCase.takerFee,
        makerFee: testCase.makerFee,
        userAddress: testCase.userAddress,
        userPositionShares: testCase.userPositionShares,
        outcomeId: testCase.outcomeId,
        range: testCase.range,
        marketOrderBook: testCase.marketOrderBook,
        scalarMinMax: testCase.scalarMinMax
      });
      testCase.assertions(actions);
    });
  }

  var txOriginal;
  var calculateTradeTotals;
  before("getTradingActions", function () {
    txOriginal = augur.tx;
    calculateTradeTotals = augur.calculateTradeTotals;
    augur.tx = new require("augur-contracts").Tx(constants.DEFAULT_NETWORK_ID).functions;
    augur.calculateTradeTotals = function (type, numShares, limitPrice, tradeActions) {
      return tradeActions;
    };
  });

  after("getTradingActions", function () {
    augur.tx = txOriginal;
  });

  describe("buy actions", function () {
    runTestCase({
      description: "no asks",
      type: "buy",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "0",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {},
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 1);
        var expected = [{
          action: "BID",
          shares: "5",
          gasEth: "0.01450404",
          feeEth: "0.0288",
          costEth: "3.0288",
          avgPrice: "0.60576",
          feePercent: "0.96",
          noFeePrice: "0.6"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "no limit price and no asks",
      type: "buy",
      orderShares: "5",
      orderLimitPrice: null,
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "0",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {},
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 0);
      }
    });

    runTestCase({
      description: "no suitable asks",
      type: "buy",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "0",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {},
        sell: {
          "order1": {
            id: "order1",
            type: "sell",
            amount: "5",
            price: "0.7", // price too high
            fullPrecisionPrice: "0.7",
            outcome: "outcomeasdf123"
          },
          "order2": {
            id: "order2",
            owner: abi.format_address("abcd1234"), // user's ask
            type: "sell",
            amount: "5",
            price: "0.6",
            fullPrecisionPrice: "0.6",
            outcome: "outcomeasdf123"
          },
          "order3": {
            id: "order3",
            type: "sell",
            amount: "5",
            price: "0.6",
            fullPrecisionPrice: "0.6",
            outcome: "differentOutcome" // different outcome
          }
        }
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 1);
        var expected = [{
          action: "BID",
          shares: "5",
          gasEth: "0.01450404",
          feeEth: "0.0288",
          costEth: "3.0288",
          avgPrice: "0.60576",
          feePercent: "0.96",
          noFeePrice: "0.6"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "ask with same shares and price",
      type: "buy",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "0",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {},
        sell: {
          "order1": {
            id: "order1",
            type: "sell",
            amount: "5",
            price: "0.6",
            fullPrecisionPrice: "0.6",
            outcome: "outcomeasdf123"
          }
        }
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 1);
        var expected = [{
          action: "BUY",
          shares: "5",
          gasEth: "0.01574842",
          feeEth: "0.0576",
          costEth: "3.0576",
          avgPrice: "0.61152",
          feePercent: "1.8838304552590266",
          noFeePrice: "0.6"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "ask with same shares and price, shares below precision limit",
      type: "buy",
      orderShares: "0.0001",
      orderLimitPrice: "0.8",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "0",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {},
        sell: {
          "order1": {
            id: "order1",
            type: "sell",
            amount: "0.0001",
            price: "0.8",
            fullPrecisionPrice: "0.8",
            outcome: "outcomeasdf123"
          }
        }
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        var expected = [{
          action: "BUY",
          shares: "0.0001",
          gasEth: "0.01574842",
          feeEth: "0.000001024",
          costEth: "0.000081024",
          avgPrice: "0.81024",
          feePercent: "1.263823064770932",
          noFeePrice: "0.8"
        }];
        assert.lengthOf(actions, expected.length);
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "ask with less shares and same price",
      type: "buy",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "0",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {},
        sell: {
          "order1": {
            id: "order1",
            type: "sell",
            amount: "2",
            price: "0.6",
            fullPrecisionPrice: "0.6",
            outcome: "outcomeasdf123"
          }
        }
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 2);
        var expected = [{
          action: "BUY",
          shares: "2",
          gasEth: "0.01574842",
          feeEth: "0.02304",
          costEth: "1.22304",
          avgPrice: "0.61152",
          feePercent: "1.8838304552590266",
          noFeePrice: "0.6"
        }, {
          action: "BID",
          shares: "3",
          gasEth: "0.01450404",
          feeEth: "0.01728",
          costEth: "1.81728",
          avgPrice: "0.60576",
          feePercent: "0.96",
          noFeePrice: "0.6"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "ask with same shares and lower price",
      type: "buy",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "0",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {},
        sell: {
          "order1": {
            id: "order1",
            type: "sell",
            amount: "5",
            price: "0.4",
            fullPrecisionPrice: "0.4",
            outcome: "outcomeasdf123"
          }
        }
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 1);
        var expected = [{
          action: "BUY",
          shares: "5",
          gasEth: "0.01574842",
          feeEth: "0.0384",
          costEth: "2.0384",
          avgPrice: "0.40768",
          feePercent: "1.8838304552590266",
          noFeePrice: "0.4"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "ask with less shares and lower price",
      type: "buy",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "0",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {},
        sell: {
          "order1": {
            id: "order1",
            type: "sell",
            amount: "2",
            price: "0.4",
            fullPrecisionPrice: "0.4",
            outcome: "outcomeasdf123"
          }
        }
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 2);
        var expected = [{
          action: "BUY",
          shares: "2",
          gasEth: "0.01574842",
          feeEth: "0.01536",
          costEth: "0.81536",
          avgPrice: "0.40768",
          feePercent: "1.8838304552590266",
          noFeePrice: "0.4"
        }, {
          action: "BID",
          shares: "3",
          gasEth: "0.01450404",
          feeEth: "0.01728",
          costEth: "1.81728",
          avgPrice: "0.60576",
          feePercent: "0.96",
          noFeePrice: "0.6"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "asks with same shares and lower prices",
      type: "buy",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "0",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {},
        sell: {
          "order1": {
            id: "order1",
            type: "sell",
            amount: "1",
            price: "0.4",
            fullPrecisionPrice: "0.4",
            outcome: "outcomeasdf123"
          },
          "order2": {
            id: "order2",
            type: "sell",
            amount: "2",
            price: "0.3",
            fullPrecisionPrice: "0.3",
            outcome: "outcomeasdf123"
          },
          "order3": {
            id: "order3",
            type: "sell",
            amount: "2",
            price: "0.2",
            fullPrecisionPrice: "0.2",
            outcome: "outcomeasdf123"
          }
        }
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 1);
        var expected = [{
          action: "BUY",
          shares: "5",
          gasEth: "0.01574842",
          feeEth: "0.02288",
          costEth: "1.42288",
          avgPrice: "0.284576",
          feePercent: "1.6080062970875969",
          noFeePrice: "0.28"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "asks with less shares and lower price",
      type: "buy",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "0",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {},
        sell: {
          "order1": {
            id: "order1",
            type: "sell",
            amount: "1",
            price: "0.4",
            fullPrecisionPrice: "0.4",
            outcome: "outcomeasdf123"
          },
          "order2": {
            id: "order2",
            type: "sell",
            amount: "2",
            price: "0.3",
            fullPrecisionPrice: "0.3",
            outcome: "outcomeasdf123"
          }
        }
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 2);
        var expected = [{
          action: "BUY",
          shares: "3",
          gasEth: "0.01574842",
          feeEth: "0.01776",
          costEth: "1.01776",
          avgPrice: "0.339253333333333333",
          feePercent: "1.7450086464392391",
          noFeePrice: "0.333333333333333333"
        }, {
          action: "BID",
          shares: "2",
          gasEth: "0.01450404",
          feeEth: "0.01152",
          costEth: "1.21152",
          avgPrice: "0.60576",
          feePercent: "0.96",
          noFeePrice: "0.6"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "no limit price specified and asks on order book",
      type: "buy",
      orderShares: "5",
      orderLimitPrice: null,
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "0",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {},
        sell: {
          "order1": {
            id: "order1",
            type: "sell",
            amount: "1",
            price: "0.4",
            fullPrecisionPrice: "0.4",
            outcome: "outcomeasdf123"
          },
          "order2": {
            id: "order2",
            type: "sell",
            amount: "2",
            price: "0.3",
            fullPrecisionPrice: "0.3",
            outcome: "outcomeasdf123"
          }
        }
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 1);
        var expected = [{
          action: "BUY",
          shares: "3",
          gasEth: "0.01574842",
          feeEth: "0.01776",
          costEth: "1.01776",
          noFeePrice: "0.333333333333333333",
          feePercent: "1.7450086464392391",
          avgPrice: "0.339253333333333333"
        }];
        testTradeActions(actions, expected);
      }
    });
  });

  describe("sell actions", function () {
    runTestCase({
      description: "no bids, no position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "0",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {},
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 1);
        var expected = [{
          action: "SHORT_ASK",
          shares: "5",
          gasEth: "0.02791268",
          feeEth: "0.0288",
          costEth: "-5.0288",
          avgPrice: "1.00576",
          feePercent: "0.96",
          noFeePrice: "0.6"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "bid with same shares and prices, no position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "0",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {
          "order1": {
            id: "order1",
            type: "buy",
            amount: "5",
            price: "0.6",
            fullPrecisionPrice: "0.6",
            outcome: "outcomeasdf123"
          }
        },
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 1);
        var expected = [{
          action: "SHORT_SELL",
          shares: "5",
          gasEth: "0.02119592",
          feeEth: "0.0576",
          costEth: "2.9424",
          avgPrice: "0.58848",
          feePercent: "1.9575856443719412",
          noFeePrice: "0.6"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "bid with less amount and same price, position greater than remaining order shares",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "6",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {
          "order1": {
            id: "order1",
            type: "buy",
            amount: "2",
            price: "0.6",
            fullPrecisionPrice: "0.6",
            outcome: "outcomeasdf123"
          }
        },
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 2);
        var expected = [{
          action: "SELL",
          shares: "2",
          gasEth: "0.01574842",
          feeEth: "0.02304",
          costEth: "1.17696",
          avgPrice: "0.58848",
          feePercent: "1.9575856443719412",
          noFeePrice: "0.6"
        }, {
          action: "ASK",
          shares: "3",
          gasEth: "0.01393518",
          feeEth: "0.01728",
          costEth: "1.78272",
          avgPrice: "0.59424",
          feePercent: "0.96",
          noFeePrice: "0.6"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "bid with less amount and same price, position smaller than remaining order shares",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "4",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {
          "order1": {
            id: "order1",
            type: "buy",
            amount: "2",
            price: "0.6",
            fullPrecisionPrice: "0.6",
            outcome: "outcomeasdf123"
          }
        },
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 3);
        var expected = [{
          action: "SELL",
          shares: "2",
          gasEth: "0.01574842",
          feeEth: "0.02304",
          costEth: "1.17696",
          avgPrice: "0.58848",
          feePercent: "1.9575856443719412",
          noFeePrice: "0.6"
        }, {
          action: "ASK",
          shares: "2",
          gasEth: "0.01393518",
          feeEth: "0.01152",
          costEth: "1.18848",
          avgPrice: "0.59424",
          feePercent: "0.96",
          noFeePrice: "0.6"
        }, {
          action: "SHORT_ASK",
          shares: "1",
          gasEth: "0.02791268",
          feeEth: "0.00576",
          costEth: "-1.00576",
          avgPrice: "1.00576",
          feePercent: "0.96",
          noFeePrice: "0.6"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "bid with less amount and same price, no position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "0",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {
          "order1": {
            id: "order1",
            type: "buy",
            amount: "2",
            price: "0.6",
            fullPrecisionPrice: "0.6",
            outcome: "outcomeasdf123"
          }
        },
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 2);
        var expected = [{
          action: "SHORT_SELL",
          shares: "2",
          gasEth: "0.02119592",
          feeEth: "0.02304",
          costEth: "1.17696",
          avgPrice: "0.58848",
          feePercent: "1.9575856443719412",
          noFeePrice: "0.6"
        }, {
          action: "SHORT_ASK",
          shares: "3",
          gasEth: "0.02791268",
          feeEth: "0.01728",
          costEth: "-3.01728",
          avgPrice: "1.00576",
          feePercent: "0.96",
          noFeePrice: "0.6"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "bid with same shares and higher price, no position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "0",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {
          "order1": {
            id: "order1",
            type: "buy",
            amount: "5",
            price: "0.7",
            fullPrecisionPrice: "0.7",
            outcome: "outcomeasdf123"
          }
        },
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 1);
        var expected = [{
          action: "SHORT_SELL",
          shares: "5",
          gasEth: "0.02119592",
          feeEth: "0.0588",
          costEth: "3.4412",
          avgPrice: "0.68824",
          feePercent: "1.7087062652563059",
          noFeePrice: "0.7"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "bid with less shares and higher price, no position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "0",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {
          "order1": {
            id: "order1",
            type: "buy",
            amount: "2",
            price: "0.7",
            fullPrecisionPrice: "0.7",
            outcome: "outcomeasdf123"
          }
        },
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 2);
        var expected = [{
          action: "SHORT_SELL",
          shares: "2",
          gasEth: "0.02119592",
          feeEth: "0.02352",
          costEth: "1.37648",
          avgPrice: "0.68824",
          feePercent: "1.7087062652563059",
          noFeePrice: "0.7"
        }, {
          action: "SHORT_ASK",
          shares: "3",
          gasEth: "0.02791268",
          feeEth: "0.01728",
          costEth: "-3.01728",
          avgPrice: "1.00576",
          feePercent: "0.96",
          noFeePrice: "0.6"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "bids with less shares and higher prices, no position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "0",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {
          "order1": {
            id: "order1",
            type: "buy",
            amount: "1",
            price: "0.7",
            fullPrecisionPrice: "0.7",
            outcome: "outcomeasdf123"
          },
          "order2": {
            id: "order2",
            type: "buy",
            amount: "2",
            price: "0.8",
            fullPrecisionPrice: "0.8",
            outcome: "outcomeasdf123"
          }
        },
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 2);
        var expected = [{
          action: "SHORT_SELL",
          shares: "3",
          gasEth: "0.02119592",
          feeEth: "0.03224",
          costEth: "2.26776",
          avgPrice: "0.75592",
          feePercent: "1.4216671958231911",
          noFeePrice: "0.766666666666666666"
        }, {
          action: "SHORT_ASK",
          shares: "2",
          gasEth: "0.02791268",
          feeEth: "0.01152",
          costEth: "-2.01152",
          avgPrice: "1.00576",
          feePercent: "0.96",
          noFeePrice: "0.6"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "bids with same shares and higher prices, no position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "0",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {
          "order1": {
            id: "order1",
            type: "buy",
            amount: "1",
            price: "0.7",
            fullPrecisionPrice: "0.7",
            outcome: "outcomeasdf123"
          },
          "order2": {
            id: "order2",
            type: "buy",
            amount: "2",
            price: "0.8",
            fullPrecisionPrice: "0.8",
            outcome: "outcomeasdf123"
          },
          "order3": {
            id: "order3",
            type: "buy",
            amount: "2",
            price: "0.9",
            fullPrecisionPrice: "0.9",
            outcome: "outcomeasdf123"
          }
        },
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 1);
        var expected = [{
          action: "SHORT_SELL",
          shares: "5",
          gasEth: "0.02119592",
          feeEth: "0.0452",
          costEth: "4.0548",
          avgPrice: "0.81096",
          feePercent: "1.1147282233402387",
          noFeePrice: "0.82"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "no limit price, bids with same shares, no position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: null,
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "0",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {
          "order1": {
            id: "order1",
            type: "buy",
            amount: "1",
            price: "0.7",
            fullPrecisionPrice: "0.7",
            outcome: "outcomeasdf123"
          },
          "order2": {
            id: "order2",
            type: "buy",
            amount: "2",
            price: "0.8",
            fullPrecisionPrice: "0.8",
            outcome: "outcomeasdf123"
          },
          "order3": {
            id: "order3",
            type: "buy",
            amount: "2",
            price: "0.9",
            fullPrecisionPrice: "0.9",
            outcome: "outcomeasdf123"
          }
        },
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 0);
      }
    });

    runTestCase({
      description: "no bids, smaller position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "2",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {},
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 2);
        var expected = [{
          action: "ASK",
          shares: "2",
          gasEth: "0.01393518",
          feeEth: "0.01152",
          costEth: "1.18848",
          avgPrice: "0.59424",
          feePercent: "0.96",
          noFeePrice: "0.6"
        }, {
          action: "SHORT_ASK",
          shares: "3",
          gasEth: "0.02791268",
          feeEth: "0.01728",
          costEth: "-3.01728",
          avgPrice: "1.00576",
          feePercent: "0.96",
          noFeePrice: "0.6"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "bid with same shares and price, smaller position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "2",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {
          "order1": {
            id: "order1",
            type: "buy",
            amount: "5",
            price: "0.6",
            fullPrecisionPrice: "0.6",
            outcome: "outcomeasdf123"
          }
        },
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 2);
        var expected = [{
          action: "SELL",
          shares: "2",
          gasEth: "0.01574842",
          feeEth: "0.02304",
          costEth: "1.17696",
          avgPrice: "0.58848",
          feePercent: "1.9575856443719412",
          noFeePrice: "0.6"
        }, {
          action: "SHORT_SELL",
          shares: "3",
          gasEth: "0.02119592",
          feeEth: "0.03456",
          costEth: "1.76544",
          avgPrice: "0.58848",
          feePercent: "1.9575856443719412",
          noFeePrice: "0.6"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "bid with less shares and same price, smaller position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "2",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {
          "order1": {
            id: "order1",
            type: "buy",
            amount: "2",
            price: "0.6",
            fullPrecisionPrice: "0.6",
            outcome: "outcomeasdf123"
          }
        },
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 2);
        var expected = [{
          action: "SELL",
          shares: "2",
          gasEth: "0.01574842",
          feeEth: "0.02304",
          costEth: "1.17696",
          avgPrice: "0.58848",
          feePercent: "1.9575856443719412",
          noFeePrice: "0.6"
        }, {
          action: "SHORT_ASK",
          shares: "3",
          gasEth: "0.02791268",
          feeEth: "0.01728",
          costEth: "-3.01728",
          avgPrice: "1.00576",
          feePercent: "0.96",
          noFeePrice: "0.6"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "bid with same shares and higher price, smaller position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "2",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {
          "order1": {
            id: "order1",
            type: "buy",
            amount: "5",
            price: "0.7",
            fullPrecisionPrice: "0.7",
            outcome: "outcomeasdf123"
          }
        },
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 2);
        var expected = [{
          action: "SELL",
          shares: "2",
          gasEth: "0.01574842",
          feeEth: "0.02352",
          costEth: "1.37648",
          avgPrice: "0.68824",
          feePercent: "1.7087062652563059",
          noFeePrice: "0.7"
        }, {
          action: "SHORT_SELL",
          shares: "3",
          gasEth: "0.02119592",
          feeEth: "0.03528",
          costEth: "2.06472",
          avgPrice: "0.68824",
          feePercent: "1.7087062652563059",
          noFeePrice: "0.7"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "bid with less shares and higher price, smaller position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "2",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {
          "order1": {
            id: "order1",
            type: "buy",
            amount: "2",
            price: "0.7",
            fullPrecisionPrice: "0.7",
            outcome: "outcomeasdf123"
          }
        },
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 2);
        var expected = [{
          action: "SELL",
          shares: "2",
          gasEth: "0.01574842",
          feeEth: "0.02352",
          costEth: "1.37648",
          avgPrice: "0.68824",
          feePercent: "1.7087062652563059",
          noFeePrice: "0.7"
        }, {
          action: "SHORT_ASK",
          shares: "3",
          gasEth: "0.02791268",
          feeEth: "0.01728",
          costEth: "-3.01728",
          avgPrice: "1.00576",
          feePercent: "0.96",
          noFeePrice: "0.6"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "bids with less shares and higher prices, smaller position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "2",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {
          "order1": {
            id: "order1",
            type: "buy",
            amount: "1",
            price: "0.7",
            fullPrecisionPrice: "0.7",
            outcome: "outcomeasdf123"
          },
          "order2": {
            id: "order2",
            type: "buy",
            amount: "2",
            price: "0.8",
            fullPrecisionPrice: "0.8",
            outcome: "outcomeasdf123"
          }
        },
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 3);
        var expected = [{
          action: "SELL",
          shares: "2",
          gasEth: "0.01574842",
          feeEth: "0.02048",
          costEth: "1.57952",
          avgPrice: "0.78976",
          feePercent: "1.2965964343598055",
          noFeePrice: "0.8"
        }, {
          action: "SHORT_SELL",
          shares: "1",
          gasEth: "0.02119592",
          feeEth: "0.01176",
          costEth: "0.68824",
          avgPrice: "0.68824",
          feePercent: "1.7087062652563059",
          noFeePrice: "0.7"
        }, {
          action: "SHORT_ASK",
          shares: "2",
          gasEth: "0.02791268",
          feeEth: "0.01152",
          costEth: "-2.01152",
          avgPrice: "1.00576",
          feePercent: "0.96",
          noFeePrice: "0.6"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "bids with same shares and higher prices, smaller position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "2",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {
          "order1": {
            id: "order1",
            type: "buy",
            amount: "1",
            price: "0.7",
            fullPrecisionPrice: "0.7",
            outcome: "outcomeasdf123"
          },
          "order2": {
            id: "order2",
            type: "buy",
            amount: "2",
            price: "0.8",
            fullPrecisionPrice: "0.8",
            outcome: "outcomeasdf123"
          },
          "order3": {
            id: "order3",
            type: "buy",
            amount: "2",
            price: "0.9",
            fullPrecisionPrice: "0.9",
            outcome: "outcomeasdf123"
          }
        },
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 2);
        var expected = [{
          action: "SELL",
          shares: "2",
          gasEth: "0.01574842",
          feeEth: "0.01296",
          costEth: "1.78704",
          avgPrice: "0.89352",
          feePercent: "0.72522159548751",
          noFeePrice: "0.9"
        }, {
          action: "SHORT_SELL",
          shares: "3",
          gasEth: "0.02119592",
          feeEth: "0.03224",
          costEth: "2.26776",
          avgPrice: "0.75592",
          feePercent: "1.4216671958231911",
          noFeePrice: "0.766666666666666666"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "no limit price, bids with same shares, smaller position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: null,
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "2",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {
          "order1": {
            id: "order1",
            type: "buy",
            amount: "1",
            price: "0.7",
            fullPrecisionPrice: "0.7",
            outcome: "outcomeasdf123"
          },
          "order2": {
            id: "order2",
            type: "buy",
            amount: "2",
            price: "0.8",
            fullPrecisionPrice: "0.8",
            outcome: "outcomeasdf123"
          },
          "order3": {
            id: "order3",
            type: "buy",
            amount: "2",
            price: "0.9",
            fullPrecisionPrice: "0.9",
            outcome: "outcomeasdf123"
          }
        },
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 1);
        var expected = [{
          action: "SELL",
          shares: "2",
          gasEth: "0.01574842",
          feeEth: "0.01296",
          costEth: "1.78704",
          avgPrice: "0.89352",
          feePercent: "0.72522159548751",
          noFeePrice: "0.9"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "no bids, same position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "5",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {},
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 1);
        var expected = [{
          action: "ASK",
          shares: "5",
          gasEth: "0.01393518",
          feeEth: "0.0288",
          costEth: "2.9712",
          avgPrice: "0.59424",
          feePercent: "0.96",
          noFeePrice: "0.6"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "bid with same shares and price, same position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "5",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {
          "order1": {
            id: "order1",
            type: "buy",
            amount: "5",
            price: "0.6",
            fullPrecisionPrice: "0.6",
            outcome: "outcomeasdf123"
          }
        },
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 1);
        var expected = [{
          action: "SELL",
          shares: "5",
          gasEth: "0.01574842",
          feeEth: "0.0576",
          costEth: "2.9424",
          avgPrice: "0.58848",
          feePercent: "1.9575856443719412",
          noFeePrice: "0.6"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "bid with less shares and same price, same position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "5",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {
          "order1": {
            id: "order1",
            type: "buy",
            amount: "2",
            price: "0.6",
            fullPrecisionPrice: "0.6",
            outcome: "outcomeasdf123"
          }
        },
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 2);
        var expected = [{
          action: "SELL",
          shares: "2",
          gasEth: "0.01574842",
          feeEth: "0.02304",
          costEth: "1.17696",
          avgPrice: "0.58848",
          feePercent: "1.9575856443719412",
          noFeePrice: "0.6"
        }, {
          action: "ASK",
          shares: "3",
          gasEth: "0.01393518",
          feeEth: "0.01728",
          costEth: "1.78272",
          avgPrice: "0.59424",
          feePercent: "0.96",
          noFeePrice: "0.6"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "bid with same shares and higher price, same position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "5",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {
          "order1": {
            id: "order1",
            type: "buy",
            amount: "5",
            price: "0.7",
            fullPrecisionPrice: "0.7",
            outcome: "outcomeasdf123"
          }
        },
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 1);
        var expected = [{
          action: "SELL",
          shares: "5",
          gasEth: "0.01574842",
          feeEth: "0.0588",
          costEth: "3.4412",
          avgPrice: "0.68824",
          feePercent: "1.7087062652563059",
          noFeePrice: "0.7"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "bid with less shares and higher price, same position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "5",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {
          "order1": {
            id: "order1",
            type: "buy",
            amount: "2",
            price: "0.7",
            fullPrecisionPrice: "0.7",
            outcome: "outcomeasdf123"
          }
        },
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 2);
        var expected = [{
          action: "SELL",
          shares: "2",
          gasEth: "0.01574842",
          feeEth: "0.02352",
          costEth: "1.37648",
          avgPrice: "0.68824",
          feePercent: "1.7087062652563059",
          noFeePrice: "0.7"
        }, {
          action: "ASK",
          shares: "3",
          gasEth: "0.01393518",
          feeEth: "0.01728",
          costEth: "1.78272",
          avgPrice: "0.59424",
          feePercent: "0.96",
          noFeePrice: "0.6"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "bids with less shares and higher prices, same position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "5",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {
          "order1": {
            id: "order1",
            type: "buy",
            amount: "1",
            price: "0.7",
            fullPrecisionPrice: "0.7",
            outcome: "outcomeasdf123"
          },
          "order2": {
            id: "order2",
            type: "buy",
            amount: "2",
            price: "0.8",
            fullPrecisionPrice: "0.8",
            outcome: "outcomeasdf123"
          }
        },
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 2);
        var expected = [{
          action: "SELL",
          shares: "3",
          gasEth: "0.01574842",
          feeEth: "0.03224",
          costEth: "2.26776",
          avgPrice: "0.75592",
          feePercent: "1.4216671958231911",
          noFeePrice: "0.766666666666666666"
        }, {
          action: "ASK",
          shares: "2",
          gasEth: "0.01393518",
          feeEth: "0.01152",
          costEth: "1.18848",
          avgPrice: "0.59424",
          feePercent: "0.96",
          noFeePrice: "0.6"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "bids with same shares and higher prices, same position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "5",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {
          "order1": {
            id: "order1",
            type: "buy",
            amount: "1",
            price: "0.7",
            fullPrecisionPrice: "0.7",
            outcome: "outcomeasdf123"
          },
          "order2": {
            id: "order2",
            type: "buy",
            amount: "2",
            price: "0.8",
            fullPrecisionPrice: "0.8",
            outcome: "outcomeasdf123"
          },
          "order3": {
            id: "order3",
            type: "buy",
            amount: "2",
            price: "0.9",
            fullPrecisionPrice: "0.9",
            outcome: "outcomeasdf123"
          }
        },
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 1);
        var expected = [{
          action: "SELL",
          shares: "5",
          gasEth: "0.01574842",
          feeEth: "0.0452",
          costEth: "4.0548",
          avgPrice: "0.81096",
          feePercent: "1.1147282233402387",
          noFeePrice: "0.82"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "no limit price, bids with same shares, same position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: null,
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "5",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {
          "order1": {
            id: "order1",
            type: "buy",
            amount: "1",
            price: "0.7",
            fullPrecisionPrice: "0.7",
            outcome: "outcomeasdf123"
          },
          "order2": {
            id: "order2",
            type: "buy",
            amount: "2",
            price: "0.8",
            fullPrecisionPrice: "0.8",
            outcome: "outcomeasdf123"
          },
          "order3": {
            id: "order3",
            type: "buy",
            amount: "2",
            price: "0.9",
            fullPrecisionPrice: "0.9",
            outcome: "outcomeasdf123"
          }
        },
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 1);
        var expected = [{
          action: "SELL",
          shares: "5",
          gasEth: "0.01574842",
          feeEth: "0.0452",
          costEth: "4.0548",
          avgPrice: "0.81096",
          feePercent: "1.1147282233402387",
          noFeePrice: "0.82"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "bid with same shares and prices, no position, scalar event",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "17",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "0",
      outcomeId: "2",
      range: "5",
      marketOrderBook: {
        buy: {
          "0x1": {
            id: "0x1",
            type: "buy",
            amount: "5",
            price: "17",
            fullPrecisionPrice: "17",
            outcome: "2"
          }
        },
        sell: {}
      },
      scalarMinMax: {minValue: "15", maxValue: "20"}, // range [15, 20]
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        var expected = [{
          action: "SHORT_SELL",
          shares: "5",
          gasEth: "0.02119592",
          feeEth: "0.288",
          feePercent: "1.9575856443719412",
          costEth: "14.712",
          avgPrice: "2.9424",
          noFeePrice: "3"
        }];
        assert.lengthOf(actions, expected.length);
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "bid with same shares and prices, equal size position, scalar event",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "17",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "5",
      outcomeId: "2",
      range: "5",
      marketOrderBook: {
        buy: {
          "0x1": {
            id: "0x1",
            type: "buy",
            amount: "5",
            price: "17",
            fullPrecisionPrice: "17",
            outcome: "2"
          }
        },
        sell: {}
      },
      scalarMinMax: {minValue: "15", maxValue: "20"}, // range [15, 20]
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        var expected = [{
          action: "SELL",
          shares: "5",
          gasEth: "0.01574842",
          feeEth: "0.192",
          feePercent: "1.9575856443719412",
          costEth: "9.808",
          avgPrice: "1.9616",
          noFeePrice: "2"
        }];
        assert.lengthOf(actions, expected.length);
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "bid with same shares and prices, smaller position, scalar event",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "17",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "3",
      outcomeId: "2",
      range: "5",
      marketOrderBook: {
        buy: {
          "0x1": {
            id: "0x1",
            type: "buy",
            amount: "5",
            price: "17",
            fullPrecisionPrice: "17",
            outcome: "2"
          }
        },
        sell: {}
      },
      scalarMinMax: {minValue: "15", maxValue: "20"}, // range [15, 20]
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        var expected = [{
          action: "SELL",
          shares: "3",
          gasEth: "0.01574842",
          feeEth: "0.1152",
          feePercent: "1.9575856443719412",
          costEth: "5.8848",
          avgPrice: "1.9616",
          noFeePrice: "2"
        }, {
          action: "SHORT_SELL",
          shares: "2",
          gasEth: "0.02119592",
          feeEth: "0.1152",
          feePercent: "1.9575856443719412",
          costEth: "5.8848",
          avgPrice: "2.9424",
          noFeePrice: "3"
        }];
        assert.lengthOf(actions, expected.length);
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "bid with same shares and prices, smaller position, scalar event",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "17",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "3",
      outcomeId: "2",
      range: "5",
      marketOrderBook: {
        buy: {
          "0x1": {
            id: "0x1",
            type: "buy",
            amount: "5",
            price: "17",
            fullPrecisionPrice: "17",
            outcome: "2"
          }
        },
        sell: {}
      },
      scalarMinMax: {minValue: "15", maxValue: "20"}, // range [15, 20]
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        var expected = [{
          action: "SELL",
          shares: "3",
          gasEth: "0.01574842",
          feeEth: "0.1152",
          feePercent: "1.9575856443719412",
          costEth: "5.8848",
          avgPrice: "1.9616",
          noFeePrice: "2"
        }, {
          action: "SHORT_SELL",
          shares: "2",
          gasEth: "0.02119592",
          feeEth: "0.1152",
          feePercent: "1.9575856443719412",
          costEth: "5.8848",
          avgPrice: "2.9424",
          noFeePrice: "3"
        }];
        assert.lengthOf(actions, expected.length);
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "bid with same shares and prices, larger position, scalar event",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "17",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "10",
      outcomeId: "2",
      range: "5",
      marketOrderBook: {
        buy: {
          "0x1": {
            id: "0x1",
            type: "buy",
            amount: "5",
            price: "17",
            fullPrecisionPrice: "17",
            outcome: "2"
          }
        },
        sell: {}
      },
      scalarMinMax: {minValue: "15", maxValue: "20"}, // range [15, 20]
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        var expected = [{
          action: "SELL",
          shares: "5",
          gasEth: "0.01574842",
          feeEth: "0.192",
          feePercent: "1.9575856443719412",
          costEth: "9.808",
          avgPrice: "1.9616",
          noFeePrice: "2"
        }];
        assert.lengthOf(actions, expected.length);
        testTradeActions(actions, expected);
      }
    });
  });
});
// import { describe, it, afterEach } from 'mocha';
// import { assert } from 'chai';
// import sinon from 'sinon';
// import proxyquire from 'proxyquire';
// import { abi } from 'services/augurjs';

// describe('modules/trade/actions/helpers/calculate-trade-ids.js', () => {
//   proxyquire.noPreserveCache();
//   const mockAugur = { augur: { filterByPriceAndOutcomeAndUserSortByPrice: () => {} } };

//   sinon.stub(mockAugur.augur, 'filterByPriceAndOutcomeAndUserSortByPrice', (orders, traderOrderType, limitPrice, outcomeId, userAddress) => {
//     // assert types of all args
//     assert.isObject(orders, `orders passed to filterByPriceAndOutcomeAndUserSortByPrice is not a Object as expected`);
//     assert.isString(traderOrderType, `traderOrderType passed to filterByPriceAndOutcomeAndUserSortByPrice is not a String as expected`);
//     assert.isString(limitPrice, `limitPrice passed to filterByPriceAndOutcomeAndUserSortByPrice is not a String as expected`);
//     assert.isString(outcomeId, `outcomeId passed to filterByPriceAndOutcomeAndUserSortByPrice is not a String as expected`);
//     assert.isString(userAddress, `userAddress passed to filterByPriceAndOutcomeAndUserSortByPrice is not a String as expected`);
//     // mock functionality...
//     let returnValue = [];

//     switch (traderOrderType) {
//       case 'buy':
//         if (abi.bignum(limitPrice).gte('0.4')) {
//           returnValue = [{ id: 3 }, { id: 4 }];
//         }
//         break;
//       default:
//         if (abi.bignum(limitPrice).lte('0.45')) {
//           returnValue = [{ id: 1 }, { id: 2 }];
//         }
//         break;
//     }

//     return returnValue;
//   });

//   afterEach(() => {
//     mockAugur.augur.filterByPriceAndOutcomeAndUserSortByPrice.reset();
//   });

//   const helper = proxyquire('../../../../src/modules/trade/actions/helpers/calculate-trade-ids', {
//     '../../../../services/augurjs': mockAugur
//   });
//   const orderBook = {
//     market1: {
//       buy: {
//         order1: {
//           id: 1,
//           price: '0.45',
//           outcome: '1',
//           owner: 'owner1'
//         },
//         order2: {
//           id: 2,
//           price: '0.45',
//           outcome: '1',
//           owner: 'owner1'
//         }
//       },
//       sell: {
//         order3: {
//           id: 3,
//           price: '0.4',
//           outcome: '1',
//           owner: 'owner1'
//         },
//         order4: {
//           id: 4,
//           price: '0.4',
//           outcome: '1',
//           owner: 'owner1'
//         }
//       }
//     }
//   };

//   it('should calculate trade ids for a Buy', () => {
//     assert.deepEqual(helper.calculateBuyTradeIDs('market1', '1', '0.5', orderBook, 'taker1'), [3, 4], `Didn't return the expected tradeIDs`);
//     assert(mockAugur.augur.filterByPriceAndOutcomeAndUserSortByPrice.calledOnce, `Didn't call augur.filterByPriceAndOutcomeAndUserSortByPrice exactly 1 time as expected`);
//     assert(mockAugur.augur.filterByPriceAndOutcomeAndUserSortByPrice.calledWithExactly({
//       order3: {
//         id: 3,
//         price: '0.4',
//         outcome: '1',
//         owner: 'owner1'
//       },
//       order4: {
//         id: 4,
//         price: '0.4',
//         outcome: '1',
//         owner: 'owner1'
//       }
//     }, 'buy', '0.5', '1', 'taker1'), `Didn't called augur.filterByPriceAndOutcomeAndUserSortByPrice with the expected args`);
//   });

//   it('should return an empty array if the trade ids for a buy at that rate are not found', () => {
//     assert.deepEqual(helper.calculateBuyTradeIDs('market1', '1', '0.3', orderBook, 'taker1'), [], `Didn't return an empty array of tradeIDs as expected`);
//     assert(mockAugur.augur.filterByPriceAndOutcomeAndUserSortByPrice.calledOnce, `Didn't call augur.filterByPriceAndOutcomeAndUserSortByPrice exactly 1 time as expected`);
//     assert(mockAugur.augur.filterByPriceAndOutcomeAndUserSortByPrice.calledWithExactly({
//       order3: {
//         id: 3,
//         price: '0.4',
//         outcome: '1',
//         owner: 'owner1'
//       },
//       order4: {
//         id: 4,
//         price: '0.4',
//         outcome: '1',
//         owner: 'owner1'
//       }
//     }, 'buy', '0.3', '1', 'taker1'), `Didn't called augur.filterByPriceAndOutcomeAndUserSortByPrice with the expected args`);
//   });

//   it('should calculate trade ids for a Sell', () => {
//     assert.deepEqual(helper.calculateSellTradeIDs('market1', '1', '0.3', orderBook, 'taker1'), [1, 2], `Didn't return the expected tradeIDs`);
//     assert(mockAugur.augur.filterByPriceAndOutcomeAndUserSortByPrice.calledOnce, `Didn't call augur.filterByPriceAndOutcomeAndUserSortByPrice exactly 1 time as expected`);
//     assert(mockAugur.augur.filterByPriceAndOutcomeAndUserSortByPrice.calledWithExactly({
//       order1: {
//         id: 1,
//         price: '0.45',
//         outcome: '1',
//         owner: 'owner1'
//       },
//       order2: {
//         id: 2,
//         price: '0.45',
//         outcome: '1',
//         owner: 'owner1'
//       }
//     }, 'sell', '0.3', '1', 'taker1'), `Didn't called augur.filterByPriceAndOutcomeAndUserSortByPrice with the expected args`);
//   });

//   it('should return an empty array if the trade IDs for a sell at the rate passed in are not found', () => {
//     assert.deepEqual(helper.calculateSellTradeIDs('market1', '1', '0.7', orderBook, 'taker1'), [], `Didn't return an empty array of tradeIDs as expected`);
//     assert(mockAugur.augur.filterByPriceAndOutcomeAndUserSortByPrice.calledOnce, `Didn't call augur.filterByPriceAndOutcomeAndUserSortByPrice exactly 1 time as expected`);
//     assert(mockAugur.augur.filterByPriceAndOutcomeAndUserSortByPrice.calledWithExactly({
//       order1: {
//         id: 1,
//         price: '0.45',
//         outcome: '1',
//         owner: 'owner1'
//       },
//       order2: {
//         id: 2,
//         price: '0.45',
//         outcome: '1',
//         owner: 'owner1'
//       }
//     }, 'sell', '0.7', '1', 'taker1'), `Didn't called augur.filterByPriceAndOutcomeAndUserSortByPrice with the expected args`);
//   });
// });
