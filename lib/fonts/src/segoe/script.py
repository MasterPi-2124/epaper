import re

# Regular expression pattern to match the lines and extract the needed parts
pattern = r"\/\/ @\d+ '([^']+)' \((\d+) pixels wide\)"

# Open the input file and a new file for the output
with open('t.txt', 'r') as infile, open('a.txt', 'w') as outfile:
    for line in infile:
        # Check if the line matches the pattern
        match = re.search(pattern, line)
        if match:
            char, width = match.groups()
            # Format the new lines for matched pattern
            new_line = f'        u"{char}", {line.strip()}\n        {width},\n'
            outfile.write(new_line)
        else:
            # Write the original line for non-matching lines
            outfile.write(line)