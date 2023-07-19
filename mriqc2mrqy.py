from tsne import bh_sne
import numpy as np
import argparse

def mriqc2mrqy(input_file, output_file):
    with open(input_file, 'r') as f_input:
        lines = f_input.readlines()

    header = lines[0].strip().split('\t')
    header[0] = "#dataset:Patient"
    header.insert(1, "Name of Images")
    
    #add t-sne (and umap header)
    header.extend(["x", "y"])    

    with open(output_file, 'w') as f_output:
        f_output.write("#start_time:	2021-12-20 09:29:49.078558\n")
        f_output.write("#outdir:	/home/UserInterface/Data/GRIEG\n")
        
        f_output.write('\t'.join(header) +'\n')

        data=[]
        subjids=[]
        for line in lines[1:]:
            values = line.strip().split('\t')
            #values = values[1:] #skip first with subjids
            subjids.append(values[0])
            data.append([float(value) for value in values[1:]])
         
        #calculate tsne coordinates
        array = np.array(data)
        data_tsne = bh_sne(array)
        xs = data_tsne[:, 0]
        ys = data_tsne[:, 1]
        #data=np.column_stack((data,xs,ys))
        
        for subjid, values, x, y in zip(subjids,data,xs,ys):
            #images = f"['{subjid}.png']"
            images = [f"{i}.png" for i in range(1, 43)]
            values.insert(0,images)
            values.insert(0,subjid)
            values.append(str(x))
            values.append(str(y))
            f_output.write('\t'.join(map(str,values)) + '\n')
            
def select_columns_and_save(input_file, output_file, selected_columns):
    with open(input_file, 'r') as f_input:
        lines = f_input.readlines()

    header = lines[2].strip().split('\t')
    column_indices = [header.index(col_name) for col_name in selected_columns]

    selected_data = []
    for line in lines[3:]:
        values = line.strip().split('\t')
        selected_values = [values[idx] for idx in column_indices]
        selected_data.append(selected_values)

    with open(output_file, 'w') as f_output:
        f_output.write(lines[0])
        f_output.write(lines[1])
        selected_header = [header[idx] for idx in column_indices]
        f_output.write('\t'.join(selected_header) + '\n')

        for values in selected_data:
            f_output.write('\t'.join(values) + '\n')


def main():
    parser = argparse.ArgumentParser(description="Convert MRIQC data to MRQY format.")
    parser.add_argument("input_file", help="Path to the input MRIQC file")
    parser.add_argument("output_file", help="Path to the output MRQY file")
    args = parser.parse_args()

    mriqc2mrqy(args.input_file, args.output_file)
    select_columns_and_save(args.output_file, args.output_file, ['#dataset:Patient', 'Name of Images', 'x', 'y','cjv', 'cnr', 'efc', 'fber', 'snr_total', 'wm2max', 'inu_med'])

if __name__ == "__main__":
    main()

