import urllib.request
import base64
import os

url = "https://raw.githubusercontent.com/googlefonts/roboto-2/main/src/hinted/Roboto-Regular.ttf"
output_file = "/Users/elifterzi/antigravity/MadameSoul/src/lib/pdfFont.ts"

print("Downloading Roboto-Regular.ttf...")
try:
    response = urllib.request.urlopen(url)
    font_data = response.read()
    print(f"Downloaded {len(font_data)} bytes.")
    
    base64_data = base64.b64encode(font_data).decode('utf-8')
    
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    with open(output_file, 'w') as f:
        f.write("// Roboto-Regular Font Base64 for jsPDF Turkish Character Support\n")
        f.write(f"export const robotoFontBase64 = '{base64_data}';\n")
        
    print(f"Successfully generated {output_file}")
except Exception as e:
    print(f"Error: {e}")
