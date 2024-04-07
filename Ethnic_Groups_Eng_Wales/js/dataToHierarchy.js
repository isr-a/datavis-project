export const convertDataToHierarchy = (d, year, WB) => {
    const newData = {
        name:"Total", 
        year: year,
        value: 0, 
        children:[
            {
                name: "White",
                year: year,
                value: 0,
                children: [
                    {
                        name: 'British',
                        year: year,
                        value: WB ? d['White: English/Welsh/Scottish/Northern Irish/British'] : 0
                    },
                    {
                        name: 'Gypsy or Irish Traveller',
                        year: year,
                        value: d['White: Gypsy or Irish Traveller']
                    },
                    {
                        name: 'Roma',
                        year: year,
                        value: d['White: Roma']
                    },
                    {
                        name: 'Irish',
                        year: year,
                        value: d['White: Irish']
                    },
                    {
                        name: 'Other White',
                        year: year,
                        value: d['White: Other White']
                    }
                ]
            },
            {
                name: "Asian",
                year: year,
                value: 0,
                children: [
                    {
                        name: "Bangladeshi",
                        year: year,
                        value: d['Asian/Asian British: Bangladeshi']
                    },
                    {
                        name: "Chinese",
                        year: year,
                        value: d['Asian/Asian British: Chinese']
                    },
                    {
                        name: "Indian",
                        year: year,
                        value: d['Asian/Asian British: Indian']
                    },
                    {
                        name: "Pakistani",
                        year: year,
                        value: d['Asian/Asian British: Pakistani']
                    },
                    {
                        name: "Other Asian",
                        year: year,
                        value: d['Asian/Asian British: Other Asian']
                    }
                ]
            },
            {
                name: "Black",
                year: year,
                value: 0,
                children: [
                    {
                        name: 'African',
                        year: year,
                        value: d['Black/African/Caribbean/Black British: African']
                    },
                    {
                        name: 'Caribbean',
                        year: year,
                        value: d['Black/African/Caribbean/Black British: Caribbean']
                    },
                    {
                        name: 'Other Black',
                        year: year,
                        value: d['Black/African/Caribbean/Black British: Other Black']
                    }
                ]
            },
            {
                name: "Mixed",
                year: year,
                value: 0,
                children: [
                    {
                        name: 'White and Asian',
                        year: year,
                        value: d['Mixed/multiple ethnic groups: White and Asian']
                    },
                    {
                        name: 'White and African',
                        year: year,
                        value: d['Mixed/multiple ethnic groups: White and Black African']
                    },
                    {
                        name: 'White and Caribbean',
                        year: year,
                        value: d['Mixed/multiple ethnic groups: White and Black Caribbean']
                    },
                    {
                        name: 'Other Mixed',
                        year: year,
                        value: d['Mixed/multiple ethnic groups: Other Mixed']
                    }
                ]
            },
            {
                name: "Other",
                year: year,
                value: 0,
                children: [
                    {
                        name: 'Arab',
                        year: year,
                        value: d['Other ethnic group: Arab']
                    },
                    {
                        name: 'Other',
                        year: year,
                        value: d['Other ethnic group: Any other ethnic group']
                    }
                ]
            }
        ]
    }
    return newData
}