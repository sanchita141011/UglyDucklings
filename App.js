var Graph = require('./Graph');
var Grid = require('./Grid');
var Runner = require('./Runner');
var Utils = require('./utilities');
var Grid = require('./Grid');
function processGrid(rowCount, columnCount, width, height, boxSize) {
  project.clear();
  const graph = new Graph(rowCount, columnCount, Grid.Box);
  graph.createGrid();
  graph.process();
  states.Context.ActiveGrid = new Grid.Grid(width, height, graph, boxSize);
  states.Context.Runner = new Runner(states.Context.ActiveGrid);
  states.Context.Runner.paintGrid();

  states.Context.ActiveGrid.onStartEndSet = function() {
    if (
      states.Context.ActiveGrid.startNode != null &&
      states.Context.ActiveGrid.endNode != null
    ) {
      states.actionPanel.removeClass("d-none");
    } else {
      states.actionPanel.addClass("d-none");
    }
  };

  states.Context.Runner.onRunnerStop = function() {
    states.startStopBtn.text("Visualize").prop("disabled", false);
    states.resetGraphBtn.prop("disabled", false);
    states.clearGraphBtn.prop("disabled", false);
    states.runnerDuration.text(
      `${states.Context.Runner.duration} ms`
    );
    states.nextStepBtn.hide();
  };
  states.algoNameDisplay.text(states.Context.Runner.finderName);
}

function resetGrid() {
  states.Context.ActiveGrid.resetTraversal();
  const sn = states.Context.ActiveGrid.startNode;
  const en = states.Context.ActiveGrid.endNode;
  sn ? sn.resetText() : null;
  en ? en.resetText() : null;
}

function init() {
  var boxSize = states.DEFAULT_BOX_SIZE;
  var [rowCount, columnCount] = Utils.getRowColumnCount(boxSize);

  states.rowCountInput.val(rowCount);
  states.columnCountInput.val(columnCount);
  states.boxSizeInput.val(boxSize);
  states.resetGraphBtn.prop("disabled", true);
  states.nextStepBtn.hide();
  states.admissibleValue.val(states.Context.AdmissibleValue);
  states.admissibleValueDisplay.text(states.Context.AdmissibleValue);

  states.rowCountInput.change(function(event) {
    rowCount = parseInt($(this).val()) || Math.trunc(states.height / t);
    processGrid(rowCount, columnCount, states.width, states.height, boxSize);
  });
  states.columnCountInput.change(function(event) {
    columnCount = parseInt($(this).val()) || Math.trunc(states.width / t);
    processGrid(rowCount, columnCount, states.width, states.height, boxSize);
  });
  states.boxSizeInput.change(function(event) {
    boxSize = parseInt($(this).val());
    [rowCount, columnCount] = getRowColumnCount(boxSize);
    processGrid(rowCount, columnCount, states.width, states.height, boxSize);
  });
  states.toolModeInput.change(function(event) {
    states.Context.ActiveGrid.actionMode = states.TOOL_MODE[this.value];
  });
  states.clearGraphBtn.click(function(event) {
    states.Context.Runner.clearGrid();
    states.startStopBtn.text("Visualize").prop("disabled", false);
    states.resetGraphBtn.prop("disabled", true);
  });
  states.resetGraphBtn.click(function(event) {
    resetGrid();
  });
  states.startStopBtn.click(function(event) {
    states.Context.Runner.init();
    states.startStopBtn.text("Running..").prop("disabled", true);
    states.runnerDuration.text("...");
    states.resetGraphBtn.prop("disabled", true);
    states.clearGraphBtn.prop("disabled", true);
  });
  states.algoSelection.click(function(event) {
    if (
      !states.Context.Runner.running ||
      states.Context.Runner.speed == 0
    ) {
      const algo = event.target.dataset["algo"];
      //const extraData = event.target.dataset;
      if (
        states.Context.Runner &&
        !states.Context.Runner.finish
      ) {
        states.Context.Runner.stop();
      }
      states.Context.Runner.getAlgo(algo);
      resetGrid();
      if (
        states.Context.ActiveGrid.startNode &&
        states.Context.ActiveGrid.endNode
      ) {
        states.actionPanel.removeClass("invisible");
      }
      states.algoNameDisplay.text(states.Context.Runner.finderName);
    }
  });

  states.speedSelection.click(function(event) {
    const runner = states.Context.Runner;
    const speed = event.target.dataset["speed"];
    runner.speed(states.RunnerSpeeds[speed]);
    states.speedNameDisplay.text(speed);
  });

  states.admissibleValue.change(function(event) {
    if (this.value < 1 || this.value > 100) {
      $(this).val(1);
    }
    states.Context.AdmissibleValue = this.value;
    states.admissibleValueDisplay.text(this.value);
  });

  processGrid(rowCount, columnCount, states.width, states.height, boxSize);
}

paper.install(window);
$(document).ready(function(_) {
  paper.setup("graph-canvas");
  init();
});

$(function() {
  $('[data-toggle="popover"]').popover();
  $('[data-toggle="tooltip"]').tooltip();
});

$(".dropdown-menu a.dropdown-toggle").on("click", function(e) {
  if (
    !$(this)
      .next()
      .hasClass("show")
  ) {
    $(this)
      .parents(".dropdown-menu")
      .first()
      .find(".show")
      .removeClass("show");
  }
  var $subMenu = $(this).next(".dropdown-menu");
  $subMenu.toggleClass("show");

  $(this)
    .parents("li.nav-item.dropdown.show")
    .on("hidden.bs.dropdown", function(e) {
      $(".dropdown-submenu .show").removeClass("show");
    });

  return false;
});
