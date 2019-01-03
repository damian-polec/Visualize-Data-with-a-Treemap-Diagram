import React, { Component } from 'react';
import * as d3 from 'd3';


class TreeMap extends Component {

    componentDidMount() {
        this.treeMap();
    }
    treeMap() {
        const color = d3.scaleOrdinal(this.props.colors)    
        const treeMapLayout = d3.treemap()
            .size([1000, 500])
            .paddingOuter(0.3);
        const root = d3.hierarchy(this.props.data)
        root.sum(function(d) {
            return d.value;
          }).sort(function(a, b) { return b.value - a.value; })
        treeMapLayout(root);

        const treeMap = d3.select('#treeMap')
            .selectAll('g')
            .data(root.leaves())
            .enter()
            .append('g')
            .attr('transform', function(d) {return 'translate(' + d.x0 + ',' + d.y0 + ')'})
        const tile = treeMap.append('rect')
            tile.attr('class', 'tile')
                .attr('data-name', d => d.data.name)
                .attr('data-category', d => d.data.category)
                .attr('data-value', d => d.data.value)
                .attr('width', function(d) { return d.x1 - d.x0 ; })
                .attr('height', function(d) { return d.y1 - d.y0; })
                .style('stroke', 'white')
                .style('fill', d => color(d.data.category))
                .style('cursor', 'pointer');
        const text = treeMap.append('text');
            text.selectAll('tspan')
                .data(d => d.data.name.split(' '))
                .enter()
                .append('tspan')
                .attr('x', 4).attr('y', (d,i) => (i * 13) + 20)
                .attr('class', 'tile-text')
                .attr('font-size', 10)
                .text(d => d)
        //Legend  
        const categories = root.leaves().map(d => d.data.category).reduce((total, acc, i ) => {
                if(total.indexOf(acc) === -1) {
                    total.push(acc);
                }
                console.log(total, i);
                return total;
            }, [])
        const legend = d3.select('#legend');

        categories.forEach((category, i) => {
            const legendRow = legend.append('g')
                .attr('transform', 'translate(0,' + (i*25) + ')')
                
            legendRow.append('rect')
                .attr('class', 'legend-item')
                .attr('width', 20)
                .attr('height', 20)
                .attr('fill', color(category));
            legendRow.append('text')
                .attr('x', 25)
                .attr('y', 15)
                .style('text-transform', 'capitalize')
                .text(category)
        })
        
        // Tooltip
        const tooltip = d3.select('#tooltip').style('opacity', 0);

        tile.on('mouseover', d => {
            tooltip.transition()
                .duration(100)
                .style('opacity', .9);
            tooltip.html(
                '<p>Name: ' + d.data.name + '</p>'
                + '<p>Category: '+ d.data.category + '</p>'
                + '<p>Value' + d.data.value + '</p>'
            )
            .attr('data-value', d.data.value)
            .style('left', (d3.event.pageX) + 'px')
            .style('top', (d3.event.pageY) + 'px')
        })
        .on('mouseout', d => {
            tooltip.transition()
                .duration(100)
                .style('opacity', 0);
        })
    }
    render () {
        return (
            <div>
                <h1 id='title'>Kickstarter Pledges</h1>
                <h3 id='description'>Top 100 Most Pledged Kickstarter Campaigns Grouped By Category</h3>
                <svg id='treeMap' height='500' width='1000'></svg>
                <svg id='legend' height='500' width='300' ></svg>
                <div id='tooltip' ></div>
            </div>
        )
    }
}

export default TreeMap;