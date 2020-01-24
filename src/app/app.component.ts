import { Component } from '@angular/core';
import {fabric} from 'fabric';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent {
  title = 'desenho-area';



  ngOnInit(){

    const DELETE = 46;
    let canvas = new fabric.Canvas("c",{selection:false});
    let finishedArea = false;
    let circles = Array();
    let points = Array();
    let optionsPolygon = {
      selectable: true,
      objectCaching: false,
      fill: 'rgba(0,0,0,.3)',
      hasBorders: false,
      hasControls: false,
    };
    let imageUrl = "https://www.detran.rs.gov.br/upload/recortes/201908/19160730_237506_GD.jpg";
    canvas.setBackgroundImage(imageUrl, canvas.renderAll.bind(canvas), {
      // Optionally add an opacity lvl to the image
      backgroundImageOpacity: 0.5,
      // should the image be resized to fit the container?
      backgroundImageStretch: false
    });

    let polygon = new fabric.Polygon(points,optionsPolygon);

    canvas.on('mouse:up',function(options){
      let p = options.pointer;      
      if(points.length < 4){
        circles.push (new fabric.Circle({
          radius: 5,
          fill: 'green',
          left: p.x,
          top: p.y,
          originX: 'center',
          originY: 'center',
          hasBorders: false,
          hasControls: false,
          name: points.length
        }));
        canvas.add(circles[points.length]);
        points.push({x:p.x, y:p.y})
      }
      if(points.length==4 && !finishedArea){
        finishedArea = true;
        polygon = new fabric.Polygon(points,optionsPolygon);
        polygon.lockScalingX = true;
        polygon.lockScalingY = true;
        polygon.lockRotation = true;
        canvas.add(polygon);
      }
    })

   

    points.forEach(function(point, index) {
      circles.push (new fabric.Circle({
        radius: 5,
        fill: 'green',
        left: point.x,
        top: point.y,
        originX: 'center',
        originY: 'center',
        hasBorders: false,
        hasControls: false,
        name: index
      }));
      canvas.add(circles[index]);
    });


    canvas.on('object:moving', function (options) {
      let objType = options.target.get('type');
      let p = options.target;
      console.log(objType);
      
      if(objType == 'polygon' || objType == 'activeSelection'){
          let firstPoint = {x: p.left, y: p.top };          
          
           points = [

            {"x": firstPoint.x - (polygon.left - points[0].x), "y": firstPoint.y - (polygon.top - points[0].y) },
          
            {"x": firstPoint.x - (polygon.left - points[1].x), "y": firstPoint.y - (polygon.top - points[1].y) },

            {"x": firstPoint.x - (polygon.left - points[2].x), "y": firstPoint.y - (polygon.top - points[2].y) },

            {"x": firstPoint.x - (polygon.left - points[3].x), "y": firstPoint.y - (polygon.top - points[3].y) },

           ];

          canvas.remove(polygon);          
          canvas.remove(circles[0]);
          canvas.remove(circles[1]);
          canvas.remove(circles[2]);
          canvas.remove(circles[3]);
          polygon = new fabric.Polygon(points, optionsPolygon);
          polygon.lockScalingX = true;
          polygon.lockScalingY = true;
          canvas.add(polygon);

          circles = Array();

          points.forEach(function(point, index) {
            circles.push (new fabric.Circle({
              radius: 5,
              fill: 'green',
              left: point.x,
              top: point.y,
              originX: 'center',
              originY: 'center',
              hasBorders: false,
              hasControls: false,
              name: index
            }));
            canvas.add(circles[index]);
          });
      }


      if(objType == 'circle'){ 
        
        canvas.remove(polygon);
        points[p.name] = {x:p.getCenterPoint().x, y: p.getCenterPoint().y};        
        polygon = new fabric.Polygon(points, optionsPolygon);
        polygon.lockScalingX = true;
        polygon.lockScalingY = true;
        canvas.add(polygon);
        //polygon.points[p.name] = {x: p.getCenterPoint().x, y: p.getCenterPoint().y};
      }
      
    });


    fabric.util.addListener(window, "keydown", options => {
      if (options.repeat) {
          return;
      }
      let key = options.which || options.keyCode;
      if (key === DELETE) {
        
        canvas.remove(polygon);
        circles.forEach(circle => {
          canvas.remove(circle)
        });
        circles = Array();
        points = Array();
        finishedArea = false;
      } 
  });
  }


  selectAll(){

  }


}

