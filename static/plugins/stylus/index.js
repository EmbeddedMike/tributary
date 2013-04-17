//You must register your plugin with the global tributary object
//id: the id should match what's in the plugin.json
//function: the plugin function which has access to the tributary instance and
//the plugin object
Tributary.plugin("stylus", stylusTributaryPlugin);

//tributary is the main object available in inlets
//plugin has some gauranteed elements:
//{
//  elId: a UUID that will also be the element id of a div
//}
//You are expected to return a plugin object with the following methods exposed:
//{
//  activate() { //initializes the plugin },
//  deactivate() { //cleans up after the plugin (removes itself) }
//}
function stylusTributaryPlugin(tributary, plugin) {
  plugin.activate = function() {
    tributary.StylusContext = tributary.CSSContext.extend({
      execute: function() {
      var that = this;
      //set the text of the style element to the code
      var imports = this.model.get("imports") || ''; //allow user to manually provide imports (for stylus functions etc)
      //HACK: remove curlies from incoming css to avoid freezing.
      var code = this.model.get("code").replace(/[{}]/g, '')
      var styl = imports + '\n' + code
      stylus(styl, { filename: this.model.get("filename") })
        .set("imports", [])  //turn off imports in browser
        .render(function(err, css) {
          if (err) {
            return that.model.trigger("error", err);
          }
          that.el.textContent = css;
          that.model.trigger("noerror");
        })
        return true;
      }
    });
  }
  
  plugin.deactivate = function() {
    delete tributary.StylusContext;
  }
  return plugin;
}
 
