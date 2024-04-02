import csv

input_file = "NEW_2011_Regions.csv"
output_file = "NEW_2011_Regions_W_Total.csv"
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
        chunk = []
        i=0
        for row in csvreader:
            chunk += [row]
            if i==19:
                result += [chunk]
                i=-1
                chunk = []
            i += 1
    return result

def modifyData21(preprocessed: list[any]) -> list[any]:
    new_data = []
    for chunk in preprocessed:
        temp = [""]*len(output_fields)
        temp[0] = "2021"
        temp[1] = chunk[0][1]
        temp[2] = chunk[0][0]
        #All
        temp[3] = str(sum(map(lambda x: int(x[4]), chunk)))
        # White
        temp[4] = str(sum(map(lambda x: int(x[4]), chunk[13:18])))
        temp[5] = chunk[13][4]
        temp[6] = chunk[14][4]
        temp[7] = chunk[15][4]
        temp[8] = chunk[16][4]
        temp[9] = chunk[17][4]
        # Mixed
        temp[10] = str(sum(map(lambda x: int(x[4]), chunk[9:13])))
        temp[11] = chunk[11][4]
        temp[12] = chunk[10][4]
        temp[13] = chunk[9][4]
        temp[14] = chunk[12][4]
        # Asian
        temp[15] = str(sum(map(lambda x: int(x[4]), chunk[1:6])))
        temp[16] = chunk[3][4]
        temp[17] = chunk[4][4]
        temp[18] = chunk[1][4]
        temp[19] = chunk[2][4]
        temp[20] = chunk[5][4]
        # Black
        temp[21] = str(sum(map(lambda x: int(x[4]), chunk[6:9])))
        temp[22] = chunk[6][4]
        temp[23] = chunk[7][4]
        temp[24] = chunk[8][4]
        # Other
        temp[25] = str(sum(map(lambda x: int(x[4]), chunk[18:20])))
        temp[26] = chunk[18][4]
        temp[27] = chunk[19][4]
        new_data += [temp]
    return new_data


def writeData(converted_list: list[any], output_file):
    with open(output_file, 'w', newline='') as file:
        csvwriter = csv.writer(file)
        csvwriter.writerow(output_fields)
        csvwriter.writerows(converted_list)
    return

def readData11(input_file: str) -> list[any]:
    with open(input_file, "r") as file:
        csvreader = csv.reader(file)

        fields = next(csvreader)

        result = []
        for row in csvreader:
            result += [row]
    return result

def modifyData11(preprocessed: list[any]) -> list[any]:
    new_data = []
    for row in preprocessed:
        temp = [""]*len(output_fields)
        temp[0:3] = row[0:3]
        temp[3:7] = row[4:8]
        temp[7] = "0"
        temp[8:28] = row[8:28]
        new_data += [temp]
    return new_data

def modifyDataAddTotal(preprocessed: list[any]) -> list[any]:
    new_data = preprocessed
    temp = [""]*len(output_fields)
    temp[0] = new_data[0][0]
    temp[1] = "England and Wales"
    temp[2] = "N/A"
    formatted = list(map(lambda x: list(map(int, x)), map(lambda x: x[3:28], new_data)))
    temp[3:28] = [sum(i) for i in zip(*formatted)]
    new_data.insert(0, temp)
    return new_data

def mergeAllData():
    all_data = []
    with open("NEW_2011_Regions_W_Total.csv", "r") as file1:
        csvreader = csv.reader(file1)
        next(csvreader)

        for row in csvreader:
            all_data += [row]
    with open("NEW_2011_Constituencies.csv", "r") as file1:
        csvreader = csv.reader(file1)
        next(csvreader)

        for row in csvreader:
            all_data += [row]
    with open("NEW_2021_Regions_W_Total.csv", "r") as file1:
        csvreader = csv.reader(file1)
        next(csvreader)

        for row in csvreader:
            all_data += [row]
    with open("NEW_2021_Constituencies.csv", "r") as file1:
        csvreader = csv.reader(file1)
        next(csvreader)

        for row in csvreader:
            all_data += [row]
    with open("Merged_Ethnic_Data.csv", 'w', newline='') as file:
        csvwriter = csv.writer(file)
        csvwriter.writerow(output_fields)
        csvwriter.writerows(all_data)
    return

def getPercentNonWhite(output_fields):
    output_fields += ["Percent Non-WB"]
    all_data = []
    with open("Merged_Ethnic_Data.csv", "r") as file1:
        csvreader = csv.reader(file1)
        next(csvreader)

        for row in csvreader:
            all_data += [row]
    new_data = []
    for row in all_data:
        temp = row
        decimal_points = 2
        percent = (1 - float(temp[5])/float(temp[3]))*100
        percent_str = "{:.{}f}%".format(percent, decimal_points)
        temp += [percent_str]
        new_data += [temp]
    with open("Merged_Ethnic_Data_Percent.csv", 'w', newline='') as file:
        csvwriter = csv.writer(file)
        csvwriter.writerow(output_fields)
        csvwriter.writerows(all_data)
    return

getPercentNonWhite(output_fields)
#imported_data = readData11(input_file)
#processed = modifyDataAddTotal(imported_data)
#writeData(processed, output_file)

#mergeAllData()
