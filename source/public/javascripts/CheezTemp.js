
    
(function () {
    var stage;
    var graph;
    var bgShape;

    function init() {

        canvas = document.getElementById('mainwindow');
        context = canvas.getContext("2d");
        stage = new createjs.Stage( canvas );
        var w = stage.canvas.width;
        var h = stage.canvas.height;

        console.log("testing");
        bgShape = new createjs.Shape();
        bgShape.graphics.beginStroke("#F00").beginFill("#00F").drawRect(20, 20, 100, 50).draw(context);
        bgShape.x = 100;
        stage.addChild(bgShape);
        createjs.Ticker.addEventListener("tick", handleTick);
    }

    function handleTick(event) {
        bgShape.x++;

        stage.update();
    }

    init();
})();
  