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
export class Table {
  numNodes = 6;
  selectedNode = -1;
  selectedEdge = -1;
  selectedFace = -1;
  data_dict = {0:'circle',1:'link',2:'faces'}

  constructor() {
    //create the required data.
    const [nodes,links] = makeGraph(this.numNodes, this.numNodes * 2);
    const faces = [[nodes[4],nodes[1],nodes[2]],[nodes[2],nodes[4],nodes[3]],[nodes[0],nodes[1],nodes[4]]]
    nodes.rank = 0;
    links.rank = 1;
    faces.rank = 2;
    this.faces = faces;
    this.links = links;
    this.nodes = nodes;
    const link = document.createElement('link', { rel: 'stylesheet', href: 'table.css' });
    document.getElementById('table').appendChild(link);  
    // Create the table element
    const table = document.createElement('table');
    table.className = 'table-holder';
    // Create the header row
    const headerRow = document.createElement('tr');
    headerRow.className = 'row-header';
    // Create the header cells
    const matrixHeader = document.createElement('th');
    matrixHeader.className = 'neighborhood-matrix';
    matrixHeader.rowSpan = 1;
    matrixHeader.innerHTML = '<b>Neighborhood</b><br><b>Matrix</b>';
    
    const structureHeader = document.createElement('th');
    structureHeader.className = 'neighborhood-structure';
    structureHeader.rowSpan = 1;
    structureHeader.innerHTML = '<b>Neighborhood</b><br><b>Structure</b>';
    
    const complexHeader = document.createElement('th');
    complexHeader.className = 'cell-complex';
    complexHeader.colSpan = 1;
    complexHeader.innerHTML = '<b>Cell Complex</b>';
    
    // Append header cells to header row
    headerRow.appendChild(matrixHeader);
    headerRow.appendChild(structureHeader);
    headerRow.appendChild(complexHeader);
    
    // Create the second row
    const secondRow = document.createElement('tr');
    secondRow.className = 'row-header';
  

    // Create the boundary row
    const boundaryRow = document.createElement('tr');
    boundaryRow.className = 'boundary';

    // Create the cells for the boundary row
    const boundaryCell1 = document.createElement('td');
    boundaryCell1.className = 'boundary-cell-one';
    boundaryCell1.innerHTML = 'boundary-cell';
    
    const boundaryCell2 = document.createElement('td');
    boundaryCell2.className = 'boundary-cell-two'; // Give an ID to the cell for appending SVG
    boundaryCell2.innerHTML = 'Hello who is this';
    
    
    const boundaryCell3 = document.createElement('td');
    boundaryCell3.className = 'boundary-cell'; // Give an ID to the cell for appending SVG
    
    // Append boundary cells to boundary row
    boundaryRow.appendChild(boundaryCell1);
    boundaryRow.appendChild(boundaryCell2);
    boundaryRow.appendChild(boundaryCell3);
    // Append all rows to the table
    table.appendChild(headerRow);
    table.appendChild(secondRow);
    table.appendChild(boundaryRow);

    // Append the table to the div
    document.getElementById('table').appendChild(table);

    // Create SVG elements and draw diagrams
    let svg = d3.select("td.boundary-cell").append('svg').attr('width', 450).attr('height', 200);
    const ex1 = svg.append('g');
    const ex2 = svg.append('g');
    const data = {1:nodes,2:links,3:faces}
    this.drawDiagram(ex1,ex2,30,0,true);
    this.drawDiagram(ex2,ex1,250,0,false);
  }

  drawDiagram(holder,ref_holder, x, y, select: true) {
    const localOffset = 0.6;
    const localScale = 150;
    const pos = (x) => (x + localOffset) * localScale;   
    holder.selectAll(`polygon`)
        .data(this.faces)
        .enter()
        .append('polygon')
        .attr('points', (d) => {
        const points = d.map(node => `${pos(node.x)+x},${pos(node.y)+y}`).join(' ');
        return points})
        .attr('fill','#e7e8e9')
        .attr('stroke', 'transparent')
      .attr('stroke-width', 2)
      .classed(`{selected}`, true)
      .on('mouseover', (d, i) => {this.selectedFace = i;this.boundarycells(holder,ref_holder,select,2)})
    .on('mouseout', () => this.unhighlightAll(holder,ref_holder));
    
    holder.selectAll('line.vis')
    .data(this.links)
    .enter()
    .append('line')
    .classed('vis', true)
    .style("stroke", "#e7e8e9")
    .style("stroke-width", 5)
    .attr("x1", (d) => pos(d.a.x)+x)
    .attr("x2", (d) => pos(d.b.x)+x)
    .attr("y1", (d) => pos(d.a.y)+y)
    .attr("y2", (d) => pos(d.b.y)+y)
    .on('mouseover', (d, i) => {this.selectedEdge = i;this.boundarycells(holder,ref_holder,select,1)})
    .on('mouseout', () => this.unhighlightAll(holder,ref_holder));

    holder.selectAll('circle')
      .data(this.nodes)
      .enter()
      .append('circle')
      .attr('r', 10)
      .attr('cx', (d) => pos(d.x)+x)
      .attr('cy', (d) => pos(d.y)+y)
      .style('fill', '#e7e8e9')
      .style("stroke-width", '1px')
      .style("stroke", '#bbb')
      .on('mouseover', (d, i) => {this.selectedNode = i;this.boundarycells(holder,ref_holder,select,0)})
      .on('mouseout', () => this.unhighlightAll(holder,ref_holder));

  }
  unhighlightAll(holder,ref_holder) {
    this.selectedEdge = -1;
    this.selectedNode = -1;
    this.selectedFace = -1;
    holder.selectAll('circle').style('fill', '#e7e8e9');
    holder.selectAll('line.vis').style("stroke", "#e7e8e9");
    holder.selectAll('polygon').style("fill", "#e7e8e9");
    ref_holder.selectAll('circle').style('fill', '#e7e8e9');
    ref_holder.selectAll('line.vis').style("stroke", "#e7e8e9");
    ref_holder.selectAll('polygon').style("fill", "#e7e8e9");
  }

  boundarycells(holder,ref_holder,select, rank) {
    if (select == false) {
      return;
    }
    if (rank <= 0) {
      return;
    }
    if (rank == 1) {
      holder.selectAll('line.vis')
      .style('stroke', (d, i) => i === this.selectedEdge ? "#c27e9e" : "#e7e8e9");
      const edgeselection = this.links.filter((link, i) => i === this.selectedEdge);
      const uniqueNodes = new Set();
      edgeselection.forEach(link => {
        uniqueNodes.add(link.a.i);
        uniqueNodes.add(link.b.i);
      })
      console.log(uniqueNodes);
      const nodesArray = Array.from(uniqueNodes);
      ref_holder.selectAll('circle')
      .style('fill', (d, i) => nodesArray.includes(i) ? "#c0dbe7" : "#e7e8e9");
    }
    if (rank == 2) {
      holder.selectAll('polygon')
      .style('fill', (d, i) => i === this.selectedFace ? "#87023e" : "#e7e8e9");
      let faceselection = this.faces.filter((link, i) => i === this.selectedFace)
      .map(face => face.map(node => node.i));
      const uniqueNodes = new Set();
      uniqueNodes.add(...faceselection);
      console.log({'nodes':uniqueNodes});

    }

    }
    
  }
