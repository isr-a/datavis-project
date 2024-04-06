export const convertDataToHierarchy = (d, WB) => {
    const newData = {
        name:"Total", 
        value: 0, 
        children:[
            {
                name: "White",
                value: 0,
                children: [
                    {
                        name: 'English/Welsh/Scottish/Northern Irish/British',
                        value: WB ? d['White: English/Welsh/Scottish/Northern Irish/British'] : 0
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
                value: 0,
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
                value: 0,
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
                value: 0,
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
                value: 0,
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