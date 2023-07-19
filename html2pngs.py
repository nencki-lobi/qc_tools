import re
import base64
import os
import argparse

def extract_base64_images_up_to_stop(html_file):
    output_dir = os.path.splitext(html_file)[0]
    os.makedirs(output_dir, exist_ok=True)
  
    with open(html_file, 'r', encoding='utf-8') as f:
        html_content = f.read()

    # Split the HTML content at the line with '<div class="card-header">Background noise</div>'
    split_content = html_content.split('<div class="card-header">Background noise</div>', 1)
    first_part = split_content[0]

    # Use regular expression to find the base64-encoded image data in the first part
    base64_images = re.findall(r'xlink:href="data:image/(\w+);base64,([^"]+)"', first_part)

    image_counter = 0
    image_id=1
    for image_format, base64_data in base64_images:
        image_bytes = base64.b64decode(base64_data)
        image_counter += 1
        if image_counter % 3 == 0:
            with open(os.path.join(output_dir,f"{image_id}.{image_format}"), 'wb') as f_output:
                f_output.write(image_bytes)
                image_id+=1
				
def main():
    parser = argparse.ArgumentParser(description="Extract images from mriqc's html")
    parser.add_argument("input_file", help="Path to the input MRIQC html")
    args = parser.parse_args()

    extract_base64_images_up_to_stop(args.input_file)

if __name__ == "__main__":
    main()