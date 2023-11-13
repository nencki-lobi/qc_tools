# Quality control tools for MRI

## table viewer
Load your CSV table and explore it with your web browser. Scroll line by line, provide notes using the scroll-down menu, and save the table as a new, evaluated version.
![screenshot](table_viewer.png)

Run with: `python -m http.server --cgi`

Hints:
- I provide JavaScript code to read data.csv table, following the structure outlined in data.csv.example.
- The original table is not modified! Utilize the save button to persist your changes.
- Input your own command into a text field for execution on each table row, for example: `freeview -v $SUBJECTS_DIR/$subj/mri/T1w.mgz`
- Rows labeled "low" and "high" serve to define lower and upper thresholds. Values outside these limits will be colored yellow.
- In the last column, images named the same as the index column ({subj}.jpg) will be loaded from the `./imgs` directory.

## mriqc2mrqy

`Now I prefer table_viewer (above) than MRQy but I leave it here.`

I offer a converter that reads the output of the mriqc app (group_T1w.csv) and enhances its visualization using MRQy (https://github.com/ccipd/MRQy). The 'html2pngs' script exports graphics saved in mriqc HTML files. Subsequently, 'mriqc2mrqy' extracts selected columns and generates TSNE and UMAP plots. Utilize the original MRQy GUI to read and display the results.
![screenshot](mrqy.png)

Todo:
- add some mods to MRQy for better viewing