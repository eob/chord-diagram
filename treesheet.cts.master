/*
 * Treesheet
 * ---------
 * 
 * This file enables your Cloudstitch app to be injected into 
 * a page as a widget. To do so, simply include cloudstitch.js 
 * in the web page HEAD: 
 * 
 *   <script src="http://cloudstitch.io/release/cloudstitch.js></script>
 * 
 * And then invoke the widget like this:
 *
 *   <div widget="visualizations/chord-diagram"></div>
 *
 */

@gsheet chordDiagramDatasource http://cloudstitch.io/visualizations/chord-diagram/datasource/chordDiagramDatasource;
@html chord-diagram //apps.cloudstitch.io/visualizations/chord-diagram/index.html;
@css relative(chord-diagram.css);
@js relative(d3.min.js);
@js relative(chord-diagram.js);

body|*[widget="visualizations/chord-diagram"] {"after": "chordDiagramWidget_PreInit"} :graft chord-diagram|#chord-diagram;
