export class tooltip {

    constructor(opacityToggle) {

        // Tooltip element definition
        const tooltipInit = d3.select("body").selectAll(".tooltip").data([null])
        this.Tooltip = tooltipInit
            .enter().append("div")
            .attr("class", "tooltip")

        // Interactivity Functions
        this.mouseover = (e, d, Tooltip) => {
            Tooltip.merge(tooltipInit)
                .style("opacity", 1)
            d3.select(e.currentTarget)
                .style("opacity", 1)
        }
        this.mousemove = (e, d, html, Tooltip) => {
            Tooltip.merge(tooltipInit)
                .style('class', console.log(d))
                .html(html(d))
                .style("left", `${e.pageX+15}px`)
                .style("top", `${e.pageY}px`)
        }
        this.mouseleave = (e, d, Tooltip) => {
            Tooltip.merge(tooltipInit)
                .style("opacity", 0)
            d3.select(e.currentTarget)
                .style("opacity", opacityToggle ? 0.8 : 1)
                .style("left", `0px`)
                .style("top", `0px`)
        }

    }
} 