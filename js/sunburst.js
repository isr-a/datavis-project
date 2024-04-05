export const sunburst = (parent, props) => {
    const {
        data,
        margin,
    } = props;

    const width = +parent.attr('width');
    const height = +parent.attr('height');
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    var data_2021 = data.filter(d => (d.date == 2021))[0]
    var data_2011 = data.filter(d => (d.date == 2011))[0]

    console.log(data_2021)

    function convertDataToHierarchy(d) {
        const newData = {
            name:"Total", 
            value: d.Total, 
            children:[
                {
                    name: "White",
                    value: d['White: Total'],
                    children: [
                        {
                            name: 'English/Welsh/Scottish/Northern Irish/British',
                            value: d['White: English/Welsh/Scottish/Northern Irish/British']
                        },
                        {
                            name: 'Gypsy or Irish Traveller',
                            value: d['White: Gypsy or Irish Traveller']
                        },
                        {
                            name: 'Roma',
                            value: d['White: Roma']
                        },
                        {
                            name: 'Irish',
                            value: d['White: Irish']
                        },
                        {
                            name: 'Other White',
                            value: d['White: Other White']
                        }
                    ]
                },
                {
                    name: "Asian",
                    value: d['Asian/Asian British: Total'],
                    children: [
                        {
                            name: "Bangladeshi",
                            value: d['Asian/Asian British: Bangladeshi']
                        },
                        {
                            name: "Chinese",
                            value: d['Asian/Asian British: Chinese']
                        },
                        {
                            name: "Indian",
                            value: d['Asian/Asian British: Indian']
                        },
                        {
                            name: "Pakistani",
                            value: d['Asian/Asian British: Pakistani']
                        },
                        {
                            name: "Other Asian",
                            value: d['Asian/Asian British: Other Asian']
                        }
                    ]
                },
                {
                    name: "Black",
                    value: d['Black/African/Caribbean/Black British: Total'],
                    children: [
                        {
                            name: 'African',
                            value: d['Black/African/Caribbean/Black British: African']
                        },
                        {
                            name: 'Caribbean',
                            value: d['Black/African/Caribbean/Black British: Caribbean']
                        },
                        {
                            name: 'Other Black',
                            value: d['Black/African/Caribbean/Black British: Other Black']
                        }
                    ]
                },
                {
                    name: "Mixed",
                    value: d['Mixed/multiple ethnic groups: Total'],
                    children: [
                        {
                            name: 'White and Asian',
                            value: d['Mixed/multiple ethnic groups: White and Asian']
                        },
                        {
                            name: 'White and Black African',
                            value: d['Mixed/multiple ethnic groups: White and Black African']
                        },
                        {
                            name: 'White and Black Caribbean',
                            value: d['Mixed/multiple ethnic groups: White and Black Caribbean']
                        },
                        {
                            name: 'Other Mixed',
                            value: d['Mixed/multiple ethnic groups: Other Mixed']
                        }
                    ]
                },
                {
                    name: "Other",
                    value: d['Other ethnic group: Total'],
                    children: [
                        {
                            name: 'Arab',
                            value: d['Other ethnic group: Arab']
                        },
                        {
                            name: 'Any other ethnic group',
                            value: d['Other ethnic group: Any other ethnic group']
                        }
                    ]
                }
            ]
        }
        return newData
    }

    data_2021 = convertDataToHierarchy(data_2021)
    data_2011 = convertDataToHierarchy(data_2011)

    console.log(data_2021)
};