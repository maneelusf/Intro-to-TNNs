
import * as d3 from 'd3';
import { makeGraph, sleep } from '../utils';
export class Table {
  numNodes = 6;
  selectedNode = -1;
  selectedEdge = -1;
  selectedFace = -1;
  constructor() {
    //create the required data.
    const [nodes,links] = makeGraph(this.numNodes, this.numNodes * 2);
    const faces = [[nodes[4],nodes[1],nodes[2]],[nodes[2],nodes[4],nodes[3]],[nodes[0],nodes[1],nodes[4]]]
    this.faces = faces;
    this.links = links;
    this.nodes = nodes;
    const link = document.createElement('link', { rel: 'stylesheet', href: 'table.css' });
    document.getElementById('table').appendChild(link);  
    const table = document.createElement('table');
    table.className = 'table-holder';
    const prologueRow = document.createElement('tr');
    prologueRow.className = 'prologue';
    const prologueHeader = document.createElement('th');
    prologueHeader.className = 'prologue-header';
    prologueHeader.rowSpan = 1;
    prologueHeader.colSpan = 3;
    const headerRow = document.createElement('tr');
    headerRow.className = 'row-header';
    // Create the header cells
    const matrixHeader = document.createElement('th');
    matrixHeader.className = 'neighborhood-matrix';
    matrixHeader.innerHTML = '<b>Neighborhood</b><br><b>Matrix</b>'; 
    const structureHeader = document.createElement('th');
    structureHeader.className = 'neighborhood-structure';
    structureHeader.innerHTML = '<b>Neighborhood</b><br><b>Structure</b>';
    const complexHeader = document.createElement('th');
    complexHeader.className = 'cell-complex';
    complexHeader.innerHTML = '<b>Cell Complex</b>';
    // Append header cells to header row
    prologueRow.appendChild(prologueHeader);     

    headerRow.appendChild(matrixHeader);
    headerRow.appendChild(structureHeader);
    headerRow.appendChild(complexHeader);
    const neighborhoodstructure = ["boundary","co-boundary","lower-adjacent","upper-adjacent"]
    const neighborhoodstructurehtml = 
    [
      'Boundary<br><span style="font-size: smaller; font-style: italic;">All y-connected cells x cells of next lower rank</span>',
      'Co-boundary<br><span style="font-size: smaller; font-style: italic;">All y-connected cells x cells of next higher rank</span>',
      'Lower adjacent<br><span style="font-size: smaller; font-style: italic;">All x cells sharing a boundary z with y</span>',
      'Upper adjacent<br><span style="font-size: smaller; font-style: italic;">All x cells sharing a co-boundary z with y</span>',
    ] 
    table.appendChild(prologueRow);
    table.appendChild(headerRow);


    // const ex1 = svg_one.append('g');
    // const ex2 = svg_one.append('g')

    for (let i = 0; i <neighborhoodstructure.length; i++) {
      const boundaryRow = document.createElement('tr');
      boundaryRow.className = neighborhoodstructure[i];
      const boundaryCell1 = document.createElement('td');
      boundaryCell1.className = neighborhoodstructure[i];
      boundaryCell1.innerHTML = neighborhoodstructurehtml[i];
      const boundaryCell2 = document.createElement('td');
      boundaryCell2.className = `${neighborhoodstructure[i]}one`; // Give an ID to the cell for appending SVG
      const boundaryCell3 = document.createElement('td');
      boundaryCell3.className = `${neighborhoodstructure[i]}two`; // Give an ID to the cell for appending SVG
      boundaryRow.appendChild(boundaryCell1);
      boundaryRow.appendChild(boundaryCell2);
      boundaryRow.appendChild(boundaryCell3);
      table.appendChild(boundaryRow);
    }
    document.getElementById('table').appendChild(table);
    for (let i = 0; i < neighborhoodstructure.length; i++) {
    const boundary1Cell = document.querySelector(`td.${neighborhoodstructure[i]}one`);
    const imgElement = document.createElement('img');
    if (i == 2 || i == 3 ) {
      const imgElementone = document.createElement('img');
      imgElementone.src =  `imgs/${neighborhoodstructure[i]}-one.png`; // Set the source path of your image
      imgElementone.style.width = '105%'
      imgElementone.style.height = '130%';
      imgElementone.style.marginLeft = '-7px'
      
      boundary1Cell.appendChild(imgElementone)
      imgElement.src =  `imgs/${neighborhoodstructure[i]}-two.png`; // Set the source path of your image
      imgElement.style.width = '105%'
      imgElement.style.height = '130%';
      imgElement.style.marginLeft = '-1px'
      imgElement.style.borderTop = '1px solid #ddd';
      boundary1Cell.appendChild(imgElement)}
    
    else {
    imgElement.src =  `imgs/${neighborhoodstructure[i]}.png`; // Set the source path of your image
    imgElement.style.width = '105%'
    imgElement.style.height = '130%';
    imgElement.style.marginLeft = '-7px'
    imgElement.style.zIndex = '-1';
    boundary1Cell.appendChild(imgElement)}}

    // Define an array of classes for different table cells
    const cellClasses = ["boundarytwo", "co-boundarytwo", "lower-adjacenttwo", "upper-adjacenttwo"];
    // Loop through each cell class
    cellClasses.forEach(cellClass => {
        // Select the table cell and append an SVG element
        let svg = d3.select(`td.${cellClass}`).append('svg').attr('width', 450).attr('height', 200);
        const ex1 = svg.append('g');
        const ex2 = svg.append('g');
        const arrow = svg.append('g');      
        this.drawDiagram(ex1, 30, 0);
        this.drawDiagram(ex2, 250, 0);
        arrow.append("defs")
        .append("marker")
        .attr("id", "triangle")
        .attr("viewBox", "0 0 10 10") // Adjusted viewBox for better visibility
        .attr("refX", 5) // Adjusted refX to center the marker
        .attr("refY", 5) // Adjusted refY to center the marker
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M 0 0 L 10 5 L 0 10 z");
        arrow.append("line")
        .attr("x1", 220)
        .attr("y1", 112.5)
        .attr("x2", 260)
        .attr("y2", 112.5)
        .attr("stroke", "black")
        .attr("marker-end", "url(#triangle)");
        // Attach appropriate mouseover event handler based on the class
        if (cellClass === "boundarytwo") {
            this.mouseoverboundary(ex1, ex2);
        } else if (cellClass === "co-boundarytwo") {
            this.mouseovercoboundary(ex1, ex2);
        }
        else if (cellClass === "lower-adjacenttwo") {
          this.mouseoverloweradjacent(ex1,ex2);
        }
        else if (cellClass === "upper-adjacenttwo") {
          this.mouseoverupperadjacent(ex1,ex2);
        }
    });
    const localOffset = 0.6;
    const localScale = 150;
    const pos = (x) => (x + localOffset) * localScale;  
    const svgContainer = d3.select('th.prologue-header').append('svg')
    .attr('width', 750)
    .attr('height', 200);
    const ex3 = svgContainer.append('g');
    this.drawPrologue(ex3);
    
}
    // Append any necessary elements to the SVG container
  drawPrologue(holder) {
    const localOffset = 0.3;
    const localScale = 120;
    const pos = (x) => (x + localOffset) * localScale; 
    const textelements = ["Examples on this complex"]
    const positions = [{'x':30,'y':80,'color':'white','circle_text':'r','side_text':'All r-cells in the complex'}, 
    {'x':30,'y':130,'color':"#c0dbe7",'circle_text':'','side_text':'All 0-cells in the complex'},
     {'x':250,'y':80,'color':"#c27e9e",'circle_text':'','side_text':'All 1-cells in the complex'}, 
     {'x':250,'y':130,'color':'#87023e','circle_text':'','side_text':'All 2-cells in the complex'}];
    for (let position of positions) {
      holder.append('circle')
      .attr('cx', position.x) // Set the x-coordinate of the center of the circle
      .attr('cy', position.y) // Set the y-coordinate of the center of the circle
      .attr('r', 10) // Set the radius of the circle
      .attr('fill', position.color)
      .attr('stroke','black');
      holder.append('text')
      .attr('x', position.x) // Set the x-coordinate of the text (center of the circle)
      .attr('y', position.y) // Set the y-coordinate of the text (center of the circle)
      .attr('text-anchor', 'middle') // Center the text horizontally
      .attr('dominant-baseline', 'central') // Center the text vertically
      // .attr('fill', 'black') // Set the color of the text
      .style('font-size', '14px') // Set the font size of the text
      .style('font-family', 'inherit')
      .style('font-weight', 'normal')
      .text(position.circle_text);
      holder.append('text')
      .attr('x', position.x+20) // Set the x-coordinate of the text (center of the circle)
      .attr('y', position.y+5) // Set the y-coordinate of the text (center of the circle)
      // .attr('fill', 'black') // Set the color of the text
      .style('font-size', '14px') // Set the font size of the text
      .style('font-family', 'inherit')
      .style('font-weight', 'normal')
      .text(position.side_text);
    }
    holder.append('text')
      .attr('x', 480) // Set the x-coordinate of the text (center of the circle)
      .attr('y', 170) // Set the y-coordinate of the text (center of the circle)
      .style('font-size', '14px') // Set the font size of the text
      .style('font-family', 'inherit')
      .style('font-weight', 'normal')
      .text("Examples based on this complex");  
      holder.append('text')
      .attr('x', 25) // Set the x-coordinate of the text (center of the circle)
      .attr('y', 195) // Set the y-coordinate of the text (center of the circle)
      .style('font-size', '14px') // Set the font size of the text
      .style('font-family', 'inherit')
      .style('font-weight', 'normal')
      .style('fill', '#a0a0a0')
      .text("Please hover over the complex on the left side to understand the message passing between the various cells.");
      holder.selectAll(`polygon`)
      .data(this.faces)
      .enter()
      .append('polygon')
      .attr('points', (d) => {
      const points = d.map(node => `${pos(node.x)+550},${pos(node.y)+50}`).join(' ');
      return points})
      .attr('fill','#87023e')
      .attr('stroke', 'transparent')
    .attr('stroke-width', 2);
    holder.selectAll('line.vis')
      .data(this.links)
      .enter()
      .append('line')
      .classed('vis', true)
      .style("stroke",  "#c27e9e")
      .style("stroke-width", 5)
      .attr("x1", (d) => pos(d.a.x)+ 550)
      .attr("x2", (d) => pos(d.b.x)+ 550)
      .attr("y1", (d) => pos(d.a.y)+50)
      .attr("y2", (d) => pos(d.b.y)+50);
    holder.selectAll('circle.diagram')
    .data(this.nodes)
    .enter()
    .append('circle')
    .attr('r', 10)
    .attr('cx', (d) => pos(d.x) + 550)
    .attr('cy', (d) => pos(d.y)+50)
    .attr('fill', "#c0dbe7")
    .attr('stroke-width', '1px')
    .attr('stroke', '#bbb');
    
  }
  drawDiagram(holder,x,y) {
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
      .attr('stroke-width', 2);
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
      .attr("y2", (d) => pos(d.b.y)+y);
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
  }

  mouseoverboundary(holder,ref_holder) {
    holder.selectAll(`polygon`)
    .on('mouseover', (d, i) => {this.selectedFace = i;this.boundarycells(holder,ref_holder,2)})
    .on('mouseout', () => this.unhighlightAll(holder,ref_holder));
    holder.selectAll("line.vis")
    .on('mouseover', (d, i) => {this.selectedEdge = i;this.boundarycells(holder,ref_holder,1)})
    .on('mouseout', () => this.unhighlightAll(holder,ref_holder));
    holder.selectAll('circle')
      .on('mouseover', (d, i) => {this.selectedNode = i;this.boundarycells(holder,ref_holder,0)})
      .on('mouseout', () => this.unhighlightAll(holder,ref_holder));

  }

  boundarycells(holder,ref_holder, rank) {
    if (rank <= 0) {
      return;
    }
    if (rank == 1) {
      holder.selectAll('line.vis')
      .style('stroke', (d, i) => i === this.selectedEdge ? "#c27e9e" : "#e7e8e9");
      const edgeselection = this.links.filter((link, i) => i === this.selectedEdge)[0];
      const selectednodes = this.linksnode(edgeselection,this.nodes).map((node) => node.i);
      ref_holder.selectAll('circle')
      .style('fill', (d, i) => selectednodes.includes(i) ? "#c0dbe7" : "#e7e8e9")
    }
    if (rank == 2) {
      holder.selectAll('polygon')
      .style('fill', (d, i) => i === this.selectedFace ? "#87023e" : "#e7e8e9");
      const faceselection = this.faces.filter((face, i) => i === this.selectedFace)[0]
      //Now these are multiple, so how do we check?
      const selectedlinks = this.facelinks(faceselection,this.links);
      ref_holder.selectAll('line.vis')
      .style("stroke", (d, i) => selectedlinks.includes(d) ? "#c27e9e" : "#e7e8e9")
    }
    }  
  mouseovercoboundary(holder,ref_holder) {
    holder.selectAll(`polygon`)
    .on('mouseover', (d, i) => {this.selectedFace = i;this.coboundarycells(holder,ref_holder,2)})
    .on('mouseout', () => this.unhighlightAll(holder,ref_holder));
    holder.selectAll("line.vis")
    .on('mouseover', (d, i) => {this.selectedEdge = i;this.coboundarycells(holder,ref_holder,1)})
    .on('mouseout', () => this.unhighlightAll(holder,ref_holder));
    holder.selectAll('circle')
      .on('mouseover', (d, i) => {this.selectedNode = i;this.coboundarycells(holder,ref_holder,0)})
      .on('mouseout', () => this.unhighlightAll(holder,ref_holder));

  }
  coboundarycells(holder,ref_holder, rank) {
    if (rank >= 2) {
      return;
    }
    if (rank == 1) {
      holder.selectAll('line.vis')
      .style('stroke', (d, i) => i === this.selectedEdge ? "#c27e9e" : "#e7e8e9");
      const edgeselection = this.links.filter((link, i) => i === this.selectedEdge)[0];
      const selectedfaces = this.linkfaces(edgeselection,this.faces);
      const faceindices = this.faces.map((face, i) => selectedfaces.includes(face) ? i : -1)
    .filter(index => index !== -1);
      ref_holder.selectAll('polygon')
      .style('fill', (d, i) => faceindices.includes(i) ? "#87023e" : "#e7e8e9");
    }
    if (rank == 0) {
      holder.selectAll('circle')
      .style('fill', (d, i) => i === this.selectedNode ? "#c0dbe7" : "#e7e8e9");
      const selectedIndices = this.links
  .map((link, i) => (link.a.i === this.selectedNode || link.b.i === this.selectedNode) ? i : -1)
  .filter(index => index !== -1);
      ref_holder.selectAll('line.vis')
        .style('stroke', (d, i) => selectedIndices.includes(i) ? "#c27e9e" : "#e7e8e9");
    }
    }  

  mouseoverloweradjacent(holder,ref_holder) {
    holder.selectAll(`polygon`)
    .on('mouseover', (d, i) => {this.selectedFace = i;this.loweradjacentcells(holder,ref_holder,2)})
    .on('mouseout', () => this.unhighlightAll(holder,ref_holder));
    holder.selectAll("line.vis")
    .on('mouseover', (d, i) => {this.selectedEdge = i;this.loweradjacentcells(holder,ref_holder,1)})
    .on('mouseout', () => this.unhighlightAll(holder,ref_holder));
    holder.selectAll('circle')
      .on('mouseover', (d, i) => {this.selectedNode = i;this.loweradjacentcells(holder,ref_holder,0)})
      .on('mouseout', () => this.unhighlightAll(holder,ref_holder));

  }
  loweradjacentcells(holder,ref_holder, rank) {
    if (rank <= 0) {
      return;
    }
    if (rank == 1) {
      // First select all the nodes. 
      holder.selectAll('line.vis')
      .style('stroke', (d, i) => i === this.selectedEdge ? "#c27e9e" : "#e7e8e9");
      const edgeselection = this.links.filter((link, i) => i === this.selectedEdge)[0];
      const selectednodes = this.linksnode(edgeselection,this.nodes).map((node) => node.i);
      ref_holder.selectAll('line.vis')
      .style('stroke', (d,i) => (selectednodes.includes(d.a.i) || selectednodes.includes(d.b.i)) & !(i === this.selectedEdge) ? "#c27e9e" : "#e7e8e9");
    }
    if (rank == 2) {
      holder.selectAll('polygon')
      .style('fill', (d, i) => i === this.selectedFace ? "#87023e" : "#e7e8e9");
      const faceselection = this.faces.filter((face, i) => i === this.selectedFace)[0];
      const selectedlinks = this.facelinks(faceselection,this.links);
      const adjacentfaces = new Set()
      for (let link of selectedlinks) {
        const faces = this.linkfaces(link,this.faces);
        for (let face of faces) {
          adjacentfaces.add(face);
        }         
      }
      adjacentfaces.delete(faceselection);
      ref_holder.selectAll('polygon')
      .style('fill', (d) => adjacentfaces.has(d) ? "#87023e" : "#e7e8e9");
    }
    }  
  
    mouseoverupperadjacent(holder,ref_holder) {
      holder.selectAll(`polygon`)
      .on('mouseover', (d, i) => {this.selectedFace = i;this.upperadjacentcells(holder,ref_holder,2)})
      .on('mouseout', () => this.unhighlightAll(holder,ref_holder));
      holder.selectAll("line.vis")
      .on('mouseover', (d, i) => {this.selectedEdge = i;this.upperadjacentcells(holder,ref_holder,1)})
      .on('mouseout', () => this.unhighlightAll(holder,ref_holder));
      holder.selectAll('circle')
        .on('mouseover', (d, i) => {this.selectedNode = i;this.upperadjacentcells(holder,ref_holder,0)})
        .on('mouseout', () => this.unhighlightAll(holder,ref_holder));
  
    }
    upperadjacentcells(holder,ref_holder, rank) {
      if (rank <= 0) {
        holder.selectAll('circle')
      .style('fill', (d, i) => i === this.selectedNode ? "#c0dbe7" : "#e7e8e9");
      const selectedNode = this.nodes.filter((node,i) => i === this.selectedNode)[0]
      const selectedlinks = this.nodelinks(selectedNode,this.links);
      const node_set = new Set();
      for (let link of selectedlinks) {
        node_set.add(link.a.i);
        node_set.add(link.b.i);
          }
      node_set.delete(this.selectedNode);
      ref_holder.selectAll('circle')
      .style('fill', (d, i) => node_set.has(i) ? "#c0dbe7" : "#e7e8e9");
  
    }

      if (rank == 1) {
        // First select all the nodes. 
        holder.selectAll('line.vis')
        .style('stroke', (d, i) => i === this.selectedEdge ? "#c27e9e" : "#e7e8e9");
        const edgeselection = this.links.filter((link, i) => i === this.selectedEdge)[0];
        const selectedfaces = this.linkfaces(edgeselection,this.faces);
        const finallinks = selectedfaces.map((face) => this.facelinks(face,this.links));
        const link_set = new Set();
        for (let link of finallinks) {
          for (let elem of link) {
            link_set.add(elem);
          }
            }
        console.log(link_set);
        ref_holder.selectAll('line.vis')
        .style('stroke', (d, i) => link_set.has(d) && this.selectedEdge != i ? "#c27e9e" : "#e7e8e9");

      }
      if (rank == 2) {
        return;
      }
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
  facelinks(face,links)  {
    // What links are connected to this face.
    const faces = face;
    const faceNodesSet = new Set();
    faces.map((node) => {faceNodesSet.add(node.i)});
    const filteredLinks = links.filter(link => faceNodesSet.has(link.a.i) && faceNodesSet.has(link.b.i));
    // link_set = new Set(filteredLinks);
    return filteredLinks}
  linksnode(link,nodes) {
      const links = link;
      const filterednodes = nodes.filter(node => (node.i == links.a.i) || (node.i == links.b.i));
      return filterednodes}

  linkfaces(link, faces) {
        // What faces are connected to this face. 
        const links = link;
        const filteredfaces = faces.filter(face => {
            const faceNodesSet = new Set(face.map(node => node.i)); // Declare faceNodesSet here
            return faceNodesSet.has(links.a.i) && faceNodesSet.has(links.b.i);
        });
        return filteredfaces;
    }
  nodelinks(node,links){
      const nodes = node;
      const filteredlinks = links.filter(link => (link.a.i == nodes.i) || (link.b.i == nodes.i));
      return filteredlinks
  }
}
