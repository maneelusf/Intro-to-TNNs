/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */


import * as d3 from 'd3';
import { makeGraph, sleep } from '../utils';


export class GraphDescription {
  parent = d3.select('#graph-description');
  svg = this.parent.append('svg').attr('width', 1200);
  numNodes = 6;
  constructor() {
    const [nodes, links] = makeGraph(this.numNodes, this.numNodes * 2);
    this.showGraph(nodes, links);
    // this.showText();
  }

  showGraph(nodes, links) {
    const localOffset = 0.6;
    const localScale = 200;
    const pos = (x) => (x + localOffset) * localScale;
    let selectedFaceIdx = -1;
    const graphHolder = this.svg.append('g');
    const simplicialHolder = this.svg.append('g');
    const cellHolder = this.svg.append('g');
    const hyperHolder = this.svg.append('g');
    const holders = [graphHolder, simplicialHolder, cellHolder, hyperHolder];
    const textElems = ["Graph Neural Network","Simipicial Cell Complex","Cell Complex","Combinatorial Complex"]
    const positions = [[5,2],[300,2],[605,2],[905,2]]
    const SimplicialcomplexFaces = [[nodes[4],nodes[1],nodes[2]],[nodes[2],nodes[4],nodes[3]],[nodes[0],nodes[1],nodes[4]]]
    const CellcomplexFaces = [[nodes[4],nodes[1],nodes[2],nodes[3]],[nodes[0],nodes[1],nodes[4]]]
    
    for (let index = 0;index<positions.length;index++) {
      const holder = holders[index];
      holder.append('rect').attr('width', 250)
        .attr('height', 250)
        .attr('x',positions[index][0])
        .attr('y', positions[index][1])
        .attr('rx', 10)
        .attr('fill', 'transparent')
        .attr('stroke', '#ddd')
        .style("stroke-width", 1)
        .attr('stroke-dasharray', "4, 4");  
      
        holder.append("text")
        .attr('x',positions[index][0]+120)
        .attr('y',positions[index][1]+280)
        .attr("text-anchor", "middle")
        .text(textElems[index])
        .style("fill", "black")
        .style("font-size", "14px");
      if (holder == hyperHolder) {
        continue;
      }
      // (d, i) => this.highlightFaces(holder)}
      // (d, i) => {this.selectedFaceIdx = i;this.highlightFaces(holder)}
      if (holder == simplicialHolder) {
        holder.selectAll('polygon')
        .data(SimplicialcomplexFaces)
        .enter()
        .append('polygon')
        .attr('points', (d) => {
        const points = d.map(node => `${pos(node.x)+positions[index][0]},${pos(node.y)}`).join(' ');
        return points;})
        .attr('fill','transparent')
        .attr('stroke', 'transparent')
      .attr('stroke-width', 2)
      // .attr('stroke-dasharray', '5,5')
        .on('mouseover', (d, i) => {this.selectedFaceIdx = i;this.highlightFaces(holder)})
        .on('mouseout', () => this.unhighlightAll())}
      
      if (holder == cellHolder) {
        holder.selectAll('polygon')
        .data(CellcomplexFaces)
        .enter()
        .append('polygon')
        .attr('points', (d) => {
        const points = d.map(node => `${pos(node.x)+positions[index][0]},${pos(node.y)}`).join(' ');
        return points;})
        .attr('fill','transparent')
        .on('mouseover', (d, i) => {this.selectedFaceIdx = i;this.highlightFaces(holder)})
        .on('mouseout', () => this.unhighlightAll())}

      
      holder.selectAll('line.vis')
      .data(links)
      .enter()
      .append('line')
      .classed('vis', true)
      .style("stroke", "#f7a3f6")
      .style("stroke-width", 1)
      .attr("x1", (d) => pos(d.a.x)+positions[index][0])
      .attr("x2", (d) => pos(d.b.x)+positions[index][0])
      .attr("y1", (d) => pos(d.a.y))
      .attr("y2", (d) => pos(d.b.y))
      holder.selectAll('line.target')
      .data(links)
      .enter()
      .append('line')
      .classed('target', true)
      .style("stroke", "rgba(0, 0, 0, 0)")
      .style("stroke-width", 10)
      .attr("x1", (d) => pos(d.a.x)+positions[index][0])
      .attr("x2", (d) => pos(d.b.x)+positions[index][0])
      .attr("y1", (d) => pos(d.a.y))
      .attr("y2", (d) => pos(d.b.y))
      .on('mouseover', () => this.highlightEdges(holder))
      .on('mouseout', () => this.unhighlightAll());
      holder.selectAll('line.vis')
        .data(links)
        .enter()
        .append('line')
        .classed('vis', true)
        .style("stroke", "#bbb")
        .style("stroke-width", 1)
        .attr("x1", (d) => pos(d.a.x)+positions[index][0])
        .attr("x2", (d) => pos(d.b.x)+positions[index][0])
        .attr("y1", (d) => pos(d.a.y))
        .attr("y2", (d) => pos(d.b.y));
      holder.selectAll('circle')
        .data(nodes)
        .enter()
        .append('circle')
        .attr('r', 10)
        .attr('cx', (d) => pos(d.x)+positions[index][0])
        .attr('cy', (d) => pos(d.y))
        .style('fill', '#ffa339')
        .style("stroke-width", '1px')
        .style("stroke", '#bbb')
        .on('mouseover', () =>  this.highlightNodes(holder))
        .on('mouseout', () => this.unhighlightAll()); 
        
  }
  // Cell Complex is different from the others. 
  

        hyperHolder.selectAll('rect.face_one')
        .data([nodes[4],nodes[1]])
        .enter()
        .append('rect.face_one')
        .attr("x", pos(nodes[2].x)-30+positions[3][0])
        .attr("y", pos(nodes[2].y)-35)
        .attr("width",180)
        .attr("height", 200)
        .attr("rx", 30) // Set the x-axis radius for rounded corners
        .attr("ry", 30) // Set the y-axis radius for rounded corners
        .style("fill", '#acbef6')
        .style("fill-opacity", 0.5)
        .on('mouseover', () => this.highlightHyperEdge(hyperHolder,"face_one"))
        .on('mouseout', () => this.unhighlightAll())
        
        hyperHolder.append('rect.face_two')
        .attr("x", pos(nodes[2].x)-25+positions[3][0])
        .attr("y", pos(nodes[2].y)-20)
        .attr("width",50)
        .attr("height", 180)
        .attr("rx", 30) // Set the x-axis radius for rounded corners
        .attr("ry", 30) // Set the y-axis radius for rounded corners
        .style("fill", "#f7a3f6")
        .style("fill-opacity", 0.5)
        .on('mouseover', () => this.highlightHyperEdge(hyperHolder,"face_two"))
        .on('mouseout', () => this.unhighlightAll());
        
        hyperHolder.append('rect.face_three')
        .attr("x", pos(nodes[2].x)-25+positions[3][0])
        .attr("y", pos(nodes[2].y)-25)
        .attr("width",170)
        .attr("height", 50)
        .attr("rx", 30) // Set the x-axis radius for rounded corners
        .attr("ry", 30) // Set the y-axis radius for rounded corners
        .style("fill", "#f7a3f6")
        .style("fill-opacity", 0.5)
        .on('mouseover', () => this.highlightHyperEdge(hyperHolder,"face_three"))
        .on('mouseout', () => this.unhighlightAll());
        
        hyperHolder.append('rect.face_four')
        .attr("x", pos(nodes[1].x)-25+positions[3][0])
        .attr("y", pos(nodes[1].y)-25)
        .attr("width",123)
        .attr("height", 50)
        .attr("rx", 30) // Set the x-axis radius for rounded corners
        .attr("ry", 30) // Set the y-axis radius for rounded corners
        .attr("transform", "rotate(-45 " + (pos(nodes[1].x)+positions[3][0]) + " " + pos(nodes[1].y) + ")")
        .style("fill", "#f7a3f6")
        .style("fill-opacity", 0.5)
        .on('mouseover', () => this.highlightHyperEdge(hyperHolder,"face_four"))
        .on('mouseout', () => this.unhighlightAll());
        const p = [{x: pos(nodes[0].x)+35+positions[3][0], y: pos(nodes[0].y)}, {x: pos(nodes[4].x)-15+positions[3][0], y: pos(nodes[4].y)+35},
         {x: pos(nodes[1].x)-15+positions[3][0], y: pos(nodes[1].y)-35}]  
        const path = this.roundedPolygon(p, 25);
        // console.log(path);
        hyperHolder.append('path')
          .attr('d',path)
          .style('fill', '#acbef6')
          .style("fill-opacity", 0.5)
        .on('mouseover', () => this.highlightHyperEdge(hyperHolder,"path"))
        .on('mouseout', () => this.unhighlightAll());;  
        hyperHolder.selectAll('circle')
        .data(nodes)
        .enter()
        .append('circle')
        .attr('r', 10)
        .attr('cx', (d) => pos(d.x)+positions[3][0])
        .attr('cy', (d) => pos(d.y))
        .style('fill', '#ffa339')
        .on('mouseover', () =>  this.highlightNodes(hyperHolder))
        .on('mouseout', () => this.unhighlightAll()); 

  }
  highlightEdges(holder) {
    // this.parent.select('#E').classed('selected', true);
    holder.selectAll('line.vis')
      .style("stroke", "#f7a3f6")
      .style("stroke-width", 5)
  }
  highlightHyperEdge(holder,rect_property) {
    const data = holder.selectAll('circle').data();

// Create circles based on the selected data
holder.selectAll('circle')
    .data(data)  // Bind data to circles
    .enter()     // Enter selection for new data
    .append('circle')  // Append circle for each data point
    .attr('cx', d => pos(d.x)+positions[3][0])  // Set x-coordinate based on data
    .attr('cy', d => pos(d.y))  // Set y-coordinate based on data
    .attr('r', 15)  // Set radius
    .style('fill', 'red');  // Set fill color
      holder.selectAll(`rect.${rect_property}`)
      .attr("fill","black")
    .attr("stroke","black")
    .attr("stroke-width", 2)
    if (rect_property == "path" )
    {holder.selectAll('path')
    .attr("fill","black")
  .attr("stroke","black")
  .attr("stroke-width", 2)}
    
  }

  highlightFaces(holder) {
    let selectedPolygonData;
    
      
    holder.selectAll('polygon')
    .attr("fill", (d, i) => {
      if (this.selectedFaceIdx == i) {
          selectedPolygonData = d; // Store the data where selectedFaceIdx == i
          return '#acbef6';
      } else {
          return "transparent";
      }
  })
  .attr("stroke", (d, i) => {
    if (this.selectedFaceIdx == i) {
        return "#f7a3f6";
    } else {
        return "transparent";
    }
})
.attr("stroke-width", (d, i) => {
  if (this.selectedFaceIdx == i) {
      return 5;
  } else {
      return 2;
  }
})
  const selectednodes = new Set()
  for (let j = 0;j<selectedPolygonData.length;j++) {
    selectednodes.add(selectedPolygonData[j].i)  
    }
    holder.selectAll('circle')
      .style("stroke-width", function(d) {
        if (selectednodes.has(d.i)) {
          return 5
        }
        else {
          return 2
        }})
      .style("stroke", function(d) {
        if (selectednodes.has(d.i)) {
          return "#000"
        }
        else {
          return "transparent"
        }})
      .attr("r", 11)
}
roundedPolygon(points, radius) {
  const qb = [];
  for (let index = 0; index < points.length; index++) {
    const first = points[index];
    const second = points[(index + 1) % points.length];
    const distance = Math.hypot(first.x - second.x, first.y - second.y);
    const ratio = radius / distance;
    const dx = (second.x - first.x) * ratio;
    const dy = (second.y - first.y) * ratio;
    qb.push({x: first.x + dx, y: first.y + dy});
    qb.push({x: second.x - dx, y: second.y - dy});
  }
  let path = `M ${qb[0].x}, ${qb[0].y} L ${qb[1].x}, ${qb[1].y}`;
  for (let index = 1; index < points.length; index++) {
    path += ` Q ${points[index].x},${points[index].y} ${qb[index * 2].x}, ${qb[index * 2].y}`
    path += ` L ${qb[index * 2 + 1].x}, ${qb[index * 2 + 1].y}`;
  }
  path += ` Q ${points[0].x},${points[0].y} ${qb[0].x}, ${qb[0].y} Z`;
  return path;
}

  highlightNodes(holder) {
    // this.parent.select('#V').classed('selected', true);
    holder.selectAll('circle')
      .style("stroke-width", 2)
      .style("stroke", '#000')
      .attr("r", 11)
  }

  highlightGlobal() {
    // this.parent.select('#U').classed('selected', true);
    this.parent.selectAll('rect')
      .style("stroke", '#000')
      .style("stroke-width", 8);
  }

  unhighlightAll() {
    this.selectedFaceIdx = -1;
    this.parent.selectAll('line.vis')
      .style("stroke", "#bbb")
      .style("stroke-width", '1px');
    
    this.parent.selectAll('polygon')
    .attr("fill","transparent")
    .attr("stroke-width",'1px')
    .attr("stroke","#bbb");
    // .style("stroke","transparent");

    this.parent.selectAll('circle')
    .style("stroke-width", '1px')
    .style("stroke", '#aaa')
    .attr("r", 10);

    // this.parent.selectAll('rect')
    //   .style("stroke-width", 2)
    //   .style("stroke")
    //   .style("stroke", '#ddd')

      this.parent.selectAll('rect')
      .attr("stroke-width", 1)
      .attr("stroke", '#ddd')

      this.parent.selectAll('path')
      .attr("stroke-width", 1)
      .attr("stroke", '#ddd')
  }
}