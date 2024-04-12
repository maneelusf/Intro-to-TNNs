const d3 = require('d3');
const points = [[0.5,0.15],[0.2,-0.2],[-0.4,-0.2],[-0.4,0.5],[0.2,0.5],[0.5,-0.5]];
let nodes = points.map((point,index) => {return {i:index, x:point[0],y:point[1],neighbors: [],
color: d3.schemeDark2[index % 8] }});

// List of connections. 
const connections = [[0,1],[1,2],[2,3],[3,4],[4,0],[1,5],[2,4],[1,4]];
const links = [];
const addNeighbor =
    (i, j) => {
      const a = nodes[i];
      const b = nodes[j];

      // Don't duplicate, but do add 1 edge for each direction.
      if (!a.neighbors.includes(b)) {
        a.neighbors.push(b);
        links.push({ a: a, b: b });
      }
      if (!b.neighbors.includes(a)) {
        b.neighbors.push(a);
        links.push({ a: b, b: a });
      }
    }
    for (let i = 0;i < connections.length;i++) {

      addNeighbor(connections[i][0],connections[i][1]);
    }

const numNodes = 6;

const faces = [[nodes[4],nodes[1],nodes[2]],[nodes[2],nodes[4],nodes[3]],[nodes[0],nodes[1],nodes[4]]]

const facelinks = (face,links) => {
    // What links are connected to this face.
    const faces = face;
    faceNodesSet = new Set();
    faces.map((node) => {faceNodesSet.add(node.i)});
    const filteredLinks = links.filter(link => faceNodesSet.has(link.a.i) && faceNodesSet.has(link.b.i));
    // link_set = new Set(filteredLinks);
    return filteredlinks
}

const linksnode = (link,nodes) => {
    // What 
    const links = link;
    const filterednodes = nodes.filter(node => (node.i == links.a.i) || (node.i == links.b.i));
    return filterednodes
}

const nodelinks = (node,links) => {
    const nodes = node;
    const filteredlinks = links.filter(link => (link.a.i == nodes.i) || (link.b.i == nodes.i));
    return filteredlinks
}

const linkfaces = (link,faces) => {
    // What faces are connected to this face. 
    const links = link;
    const filteredfaces = faces.filter(face => {faceNodesSet = new Set(face.map((node => node.i)));
    return faceNodesSet.has(links.a.i) && faceNodesSet.has(links.b.i) })
    return filteredfaces
}


