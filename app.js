var Vertex = function(xCoord, yCoord, num, color){
    this.num = num;
    this.radius = 6;
    this.xCoord = xCoord;
    this.yCoord = yCoord;
    this.color = color || "rgb(137, 174, 255)";
    this.draw = function(place){
        var text = '<text x="'+ (this.xCoord + 1) + '" y="'+ (this.yCoord + 1) +'" font-family="Verdana" font-size="10" fill="black" > P'+ num +' </text>p';
        $(place).append('<circle cx="'+ (this.xCoord + 1) +'" cy="'+ (this.yCoord + 1) +'" r="'+ this.radius +'" fill="'+ this.color +'" />' + text);
        
        $(place).html($(place).html());
    }
}
var Edge = function(v1, v2){
    this.cicle = false;
    this.v1 = v1;
    this.v2 = v2;
    this.color = "rgb(137, 174, 255)";
    this.draw = function(place){
        var height = Math.max(v1.yCoord, v2.yCoord) + 2,
            width = Math.max(v1.xCoord, v2.xCoord) + 2;
        $(place).append('<line x1="'+ v1.xCoord +'" y1="'+ v1.yCoord +'" x2="'+ v2.xCoord +'" y2="'+ v2.yCoord +'" style="stroke:'+ this.color +';stroke-width:2" />Sorry, your browser does not support inline SVG.');    
        v1.draw(place);
        v2.draw(place);
        $(place).html($(place).html());
        
    }
}

var Weight = function(vertices){
    this.matrix = [];
    this.A = [];
    this.vertices = vertices;
    this.computeWeights = function(){
        for(var i = 0; i < vertices.length; i++){
            var arr = [];
            for(var j = 0; j < vertices.length; j++){
                var max = Math.max(i, j),
                    min = Math.min(i,j);
                if((max - min) % 2 != 0 && vertices[max].color != vertices[min].color){
                    var rCount = 0, bCount = 0;
                    for(var k = min; k <= max; k++){
                        if(vertices[k].color == "red"){
                            rCount++;
                        }
                        else{
                            bCount++;
                        }
                    }
                    if(rCount == bCount){
                       var x = Math.abs(vertices[i].xCoord - vertices[j].xCoord),
                       y = Math.abs(vertices[i].yCoord - vertices[j].yCoord);
                       arr[j] = parseInt(Math.sqrt(x * x + y * y)); 
                    }
                    else{
                       arr[j] = 1000; 
                    }
                }
                else{
                    arr[j] = 1000;
                }
                
            }
            this.matrix[i] = arr;
        }
    };
    this.drawFeasibleTable = function(place){
        $(place + " table").empty().append('<tr id="wIndex"></tr>');
        $("#wIndex").append("<th>*</th>");
        for(var j = 0; j < this.matrix.length; j++){
            $("#wIndex").append("<th>"+ j +"</th>");
        }
        for(var i = 0; i < this.matrix.length; i++){
            $(place + " table").append('<tr id="w'+ i +'"></tr>'); 
            $("#w" + i).append("<th>"+ i +"</th>");
            for(var j = 0; j < this.matrix.length; j++){
                var cell = this.matrix[i][j];
                if(cell == 1000){
                    cell = "&#8734;"; //infinite symbole
                    $("#w" + i).append("<td style='font-size:20px'>"+ cell +"</td>");
                }
                else{
                    $("#w" + i).append("<td>"+ cell +"</td>");
                }
            }
        }
        for(var i = 0; i < 2; i++){
           var arr = [];
           for(var j = 0; j < this.matrix.length; j++){
               if(this.matrix[i][j] != 1000){
                   arr.push(j);
               }
           }
           var str = "";
           for(var k = 0; k < arr.length; k++){
               str += "p" + "<sub>" + arr[k] + "</sub>, ";
                
           }
           str = str.slice(0, str.length - 2);
           str = "<var>F<sub>" + i + "</sub> = {" + str + "}</var>";
           $("#feasible" + (i + 1)).empty().append(str);
        }
        $(".optSol").empty().append(this.matrix.length - 1);
    };
    this.run = function(){
        for(var i = 0; i < this.matrix.length; i++){
            this.A[i] = [];
            for(var j = 0; j < this.matrix.length; j++){
                if(i > j){
                    this.A[i][j] = 0;
                }
                if(i == j){
                    this.A[i][j] = 1000;
                }
            }
        }
        for(var i = this.matrix.length - 2; i >= 0; i--){
            for(var j = i; j < this.matrix.length; j++){
                var min = 1000, last;
                
                for(var k = i + 1; k <= j; k++){
                    if(k + 1 > j){
                        last = 0;
                    }
                    else{
                        last = this.A[k + 1][j];
                    }
                    min = Math.min(min, Math.max(this.matrix[i][k], Math.max(this.A[i + 1][k - 1], last)));
                }
                this.A[i][j] = min;
            }
        }
        
    }
    this.drawOptTable = function(place){
        $(place + " table").empty().append('<tr id="OptTableIndexes"></tr>');
        $("#OptTableIndexes").append("<th>*</th>");
        for(var j = 0; j < this.A.length; j++){
            $("#OptTableIndexes").append("<th>"+ j +"</th>");
        }
        for(var i = 0; i < this.A.length; i++){
            $(place + " table").append('<tr id="OptTable'+ i +'"></tr>'); 
            $("#OptTable" + i).append("<th>"+ i +"</th>");
            for(var j = 0; j < this.A.length; j++){
                var cell = this.A[i][j];
                if(cell == 1000){
                    cell = "&#8734;"; //infinite symbole
                    $("#OptTable" + i).append("<td style='font-size:20px'>"+ cell +"</td>");
                }
                else{
                    $("#OptTable" + i).append("<td>"+ cell +"</td>");
                }
            }
        }
    }
}

var $vertices = [], $edges = [];
$(document).ready(function(){
    $("#bs-example-navbar-collapse-1 a").click(function(e) {
        console.log(e.target.id);
        $(window).scrollTop($("#" + e.target.id + "1").position().top);
    });
    
    var color = "rgb(137, 174, 255)";
    
    $("#cForm").on('change', function(){
        if($('input[name=color]:checked', '#cForm').val() == "red"){
            color = "red";
        }
        else{
            color = "rgb(137, 174, 255)";
        }
    });
    
	$("#convexPos").click(function(e){
	    
		var x = e.offsetX, y = e.offsetY;
		
		if($vertices.length > 2 && Math.abs(x - $vertices[0].xCoord) <= 8 && Math.abs(y - $vertices[0].yCoord) <= 8){
		    var len = $vertices.length - 1;
		    $edges.push(new Edge($vertices[len], $vertices[0]));
		    $edges[$edges.length - 1].draw("#convexPos svg");
		    Edge.cicle = true;
		    var w = new Weight($vertices);
	        w.computeWeights();
	        w.drawFeasibleTable("#tFeasible");
	        w.run();
	        w.drawOptTable("#tFirstAlg");
	        
		}
		if(!Edge.cicle){
    		console.log(e);
    		$vertices.push(new Vertex(x,y, $vertices.length, color));
    		$vertices[$vertices.length - 1].draw("#convexPos svg");
    		if($vertices.length >= 2){
    		    var len = $vertices.length - 1;
    		    $edges.push(new Edge($vertices[len], $vertices[len - 1]));
    		    $edges[$edges.length - 1].draw("#convexPos svg");
    		    $vertices[$vertices.length - 1].draw("#convexPos svg");
    		}
		}
	});
	$("#restoreConvex").click(function() {
	    $("#convexPos svg").empty();
	    $("#tFeasible table").empty();
	    $("#tFirstAlg table").empty();
	    $vertices = [], $edges = [];
	    Edge.cicle = false;
	   
	})
});