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
  svg = this.parent.append('svg').attr('width':1200);
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
    const textElems = ["Graph Neural Network","Simipicial Cell Complex","Cell Complex","Colored HyperGraph"]
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
      // (d, i) => this.highlightFaces(holder)}
      // (d, i) => {this.selectedFaceIdx = i;this.highlightFaces(holder)}
      if holder == simplicialHolder {
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
      
      if holder == cellHolder {
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

      
      
      
      // .attr('stroke-dasharray', '5,5');
      holder.append("text")
    .attr('x',positions[index][0]+120)
    .attr('y',positions[index][1]+280)
    .attr("text-anchor", "middle")
    .text(textElems[index])
    .style("fill", "black")
    .style("font-size", "14px");
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
  }
  highlightEdges(holder) {
    // this.parent.select('#E').classed('selected', true);
    holder.selectAll('line.vis')
      .style("stroke", "#f7a3f6")
      .style("stroke-width", 5)
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
// .attr("fill", (d, i) => {
//   if (this.selectedFaceIdx == i) {
//       selectedPolygonData = d; // Store the data where selectedFaceIdx == i
//       return '#acbef6';
//   } else {
//       return "transparent";
//   }
// })
  

  // .style("stroke", '#000')
  // .style("stroke-width", 3);
  // const selectedlinks = new Set()
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

    this.parent.selectAll('rect')
      .style("stroke-width", 2)
      .style("stroke", '#ddd')
  }
