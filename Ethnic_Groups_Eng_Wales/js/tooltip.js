export class tooltip {

    constructor(opacityToggle) {
        this.Tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")

        this.mouseover = (e, d, Tooltip) => {
            Tooltip
                .style("opacity", 1)
            d3.select(e.currentTarget)
                .style("stroke", "black")
                .style("opacity", 1)
        }

        this.mousemove = (e, d, html, Tooltip) => {
            Tooltip
                .style('class', console.log(d))
                .html(html(d))
                .style("left", `${e.pageX+15}px`)
                .style("top", `${e.pageY}px`)
        }
        
        this.mouseleave = (e, d, Tooltip) => {
            Tooltip
                .style("opacity", 0)
            d3.select(e.currentTarget)
                .style("stroke", "none")
                .style("opacity", opacityToggle ? 0.8 : 1)
                .style("left", `0px`)
                .style("top", `0px`)
        }
    }
} 