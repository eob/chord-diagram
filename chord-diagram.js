
function chordDiagramWidget_getRowLabels(treeName) {
  return CTS(treeName + '|Data!A:A').getValue().slice(1);
}

function chordDiagramWidget_getColLabels(treeName) {
  return CTS(treeName + '|Data!1:1').getValue().slice(1);
}

function chordDiagramWidget_getCellValue(treeName, row, col) {
  var r = row + 1;
  var c = col + 1;
  return CTS(treeName + '|' + 'Data!r' + row + 'c' + col).getValue();
}

function chordDiagramWidget_Init(elem, treeName) {
  // Load data
  if (typeof tree == 'undefined') {
    treeName = 'chordDiagramWidget_Data';
  }
  if (CTS && CTS.engine && CTS.engine.forrest) {
    try {
      var data = chordDiagramWidget_Data(treeName);
      var settings = chordDiagramWidget_Settings(treeName);
      chordDiagramWidget_Draw(elem[0], data, settings);
    } catch(e) {
      console.log(e);
    }
  }
}

var chordDiagramWidget_Settings = function(treeName) {
  return {
    Width: 960,
    Height: 500,
    Padding: 200
  }
}

/* Turn Matrix
 *  B
 * A
 * into
 *   AB
 *  A0
 *  B 0
 */
var chordDiagramWidget_Data = function(treeName) {
  var rows = chordDiagramWidget_getRowLabels(treeName);
  var cols = chordDiagramWidget_getColLabels(treeName);
  var labels = [];
  var matrix = [];

  // Load the labels
  for (var i = 0; i < rows.length; i++) {
    labels.push(rows[i]);
  }
  for (var i = 0; i < cols.length; i++) {
    labels.push(cols[i]);
  }

  for (var row = 0; row < (rows.length + cols.length); row++) {
    var matrixRow = [];
    for (var col = 0; col < (rows.length + cols.length); col++) {
      var value;
      if (col < rows.length) {
        // Left Half
        if (row < rows.length) {
          // Top Left
          value = 0;
        } else {
          // Bottom Left
          var fixedRow = col;
          var fixedCol = row - rows.length;
          value = chordDiagramWidget_getCellValue(treeName, fixedRow, fixedCol);
        }
      } else {
        if (row < rows.length) {
          // Top right
          var fixedCol = col - rows.length;
          value = chordDiagramWidget_getCellValue(treeName, row, fixedCol);
        } else {
          // Bottom right
          value = 0;
        }
      }
      matrixRow.push(value);
    }
    matrix.push(matrixRow);
  }
};

function chordDiagramWidget_Draw(elem, data, settings) {
  var fill = d3.scale.category10();

  // Visualize
  var chord = d3.layout.chord()
      .padding(.05)
      .sortSubgroups(d3.descending)
      .matrix(data.matrix);

  var width = Settings.Width,
      height = Settings.Height,
      r1 = height / 2,
      innerRadius = Math.min(width, height) * .41,
      outerRadius = innerRadius * 1.1,
      outer

  var svg = d3.select(elem).append("svg")
      .attr("width", width+Settings.Padding)
      .attr("height", height+Settings.Padding)
      .append("g")
      .attr("transform", "translate(" + (width+Settings.Padding) / 2 + "," + (height+Settings.Padding) / 2 + ")");

  svg.append("g").selectAll("path")
      .data(chord.groups)
      .enter().append("path")
      .attr("class", "arc")
      .style("fill", function(d) {
          return d.index < 4 ? '#444444' : fill(d.index);
      })
      .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius))
      .on("mouseover", fade(.1))
      .on("mouseout", fade(.7));

  svg.append("g")
      .attr("class", "chord")
      .selectAll("path")
      .data(chord.chords)
      .enter().append("path")
      .attr("d", d3.svg.chord().radius(innerRadius))
      .style("fill", function(d) { return fill(d.target.index); })
      .style("opacity", 0.7);

  svg.append("g").selectAll(".arc")
      .data(chord.groups)
      .enter().append("svg:text")
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) { return ((d.startAngle + d.endAngle) / 2) > Math.PI ? "end" : null; })
      .attr("transform", function(d) {
        return "rotate(" + (((d.startAngle + d.endAngle) / 2) * 180 / Math.PI - 90) + ")"
            + "translate(" + (r1 - 15) + ")"
            + (((d.startAngle + d.endAngle) / 2) > Math.PI ? "rotate(180)" : "");
      })
      .text(function(d) {
          return data.labels[d.index];
      });

  // Returns an event handler for fading a given chord group.
  function fade(opacity) {
    return function(g, i) {
      svg.selectAll(".chord path")
        .filter(function(d) { return d.source.index != i && d.target.index != i; })
        .transition()
      .style("opacity", opacity);
    };
  }
}

function chordDiagramWidget_PreInit(ctsTarget, ctsSource, ctsRelation) {
  var widgetContainer = ctsTarget.value;
  // Need to wait for all the widget dependencies to load. This should be
  // a standard feature built in.
  var tryIt = function() {
    if ((typeof d3 != 'undefined') && (typeof window.chordDiagramWidget_Data != 'undefined')) {
      chordDiagramWidget_Init(widgetContainer);
    } else {
      setTimeout(tryIt, 100);
    }
  }
  tryIt();
}  
