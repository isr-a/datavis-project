import csv

input_file = "2011_Regions.csv"
output_file = "NEW_2011_Regions.csv"
output_fields = [
    "date",
    "geography",
    "geography code",
    "Total",
    "White: Total",
    "White: English/Welsh/Scottish/Northern Irish/British",
    "White: Irish",
    "White: Gypsy or Irish Traveller",
    "White: Roma",
    "White: Other White",
    "Mixed/multiple ethnic groups: Total",
    "Mixed/multiple ethnic groups: White and Black Caribbean",
    "Mixed/multiple ethnic groups: White and Black African",
    "Mixed/multiple ethnic groups: White and Asian",
    "Mixed/multiple ethnic groups: Other Mixed",
    "Asian/Asian British: Total",
    "Asian/Asian British: Indian",
    "Asian/Asian British: Pakistani",
    "Asian/Asian British: Bangladeshi",
    "Asian/Asian British: Chinese",
    "Asian/Asian British: Other Asian",
    "Black/African/Caribbean/Black British: Total",
    "Black/African/Caribbean/Black British: African",
    "Black/African/Caribbean/Black British: Caribbean",
    "Black/African/Caribbean/Black British: Other Black",
    "Other ethnic group: Total",
    "Other ethnic group: Arab",
    "Other ethnic group: Any other ethnic group"
]

def readData21(input_file: str) -> list[any]:
    with open(input_file, "r") as file:
        csvreader = csv.reader(file)

        fields = next(csvreader)

        result = []
        for row in csvreader:
            result += [row]
    return result

def modifyData21(preprocessed: list[any]) -> list[any]:
    new_data = []
    return new_data


def writeData21(converted_list: list[any], output_file):
    with open(output_file, 'w', newline='') as file:
        csvwriter = csv.writer(file)
        csvwriter.writerow(output_fields)
        csvwriter.writerows(converted_list)
    return
