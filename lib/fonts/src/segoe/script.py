import re
import sys

# Regular expression pattern to match the lines and extract the needed parts
pattern1 = r"@(\d+) '(.?)' \((\d+) pixels wide\)"
pattern2 = r'^\s*(0x[0-9A-Fa-f]{2},\s*)+//.*$'
pattern3 = r'//\s*Font data for ([a-zA-Z\s]+)\s(\d+)pt'

def parse_line(match):
    index = int(match.group(1))
    char = match.group(2)
    width = int(match.group(3))
    return index, char, width

def generate_cpp_struct(input):
    output = "#include <fonts.h>\n\n"
    segment1 = "const FT_MAP ASCII_table[76] = {\n"
    segment2 = "const FT_MAP vn_table[76] = {\n"
    segment3 = "const FT_MAP VN_table[77] = {\n"
    table = "const char table[] = {\n"
    fontType = ""
    filename = ""
    fontCount = 0
    linesCount = 0
    height = 0
    widthAverage = 0
    for line in input:
        linesCount += 1
        if linesCount <= 4:
            output += line
            match3 = re.search(pattern3, line)
            if match3:
                # Extract font name and size
                font_name = match3.group(1).split()[0]
                font_style = "Bold" if match3.group(1).split()[2] == "Bold" else ""
                font_size = match3.group(2)
                
                # Format the string as required
                fontType += f"{font_name}{font_size}{font_style}"
                filename += f"{font_name.lower()}{font_size}-{font_style.lower()}.cpp" if font_style == "Bold" else f"{font_name.lower()}{font_size}.cpp"
        else:
            match1 = re.search(pattern1, line)
            match2 = re.search(pattern2, line)
            if (match1):
                if (height != 0):
                    height = 0
                fontCount += 1
                table += "\n"
                parsed_data = parse_line(match1)
                if parsed_data:
                    index, char, width = parsed_data
                    widthAverage += width
                    if(fontCount <= 76):
                        segment1 += f"    {{{ord(char)}, {width}, {index}}}, // Character: '{char}'\n"
                    elif fontCount <= 152:
                        segment2 += f"    {{{ord(char)}, {width}, {index}}}, // Character: '{char}'\n"
                    else:
                        segment3 += f"    {{{ord(char)}, {width}, {index}}}, // Character: '{char}'\n"
            elif match2:
                table += line
                height += 1
                
    table += "};\n\n"
    segment1 += "};\n\n"
    segment2 += "};\n\n"
    segment3 += "};\n\n"
    
    output = output + segment1 + segment2 + segment3 + table
    output += f"const sFONT {fontType} =\n{{\n    ASCII_table,\n    vn_table,\n    VN_table,\n    {height}, // Height, in pixels, of space character\n    table,\n}};"
    
    print(widthAverage)
    
    return output, filename
    
if __name__ == "__main__":
    input = open(sys.argv[1], "r")
    output, filename = generate_cpp_struct(input)
    with open(filename, "w") as out:
        out.write(output)