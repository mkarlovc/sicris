# Bibliography list for each researcher (SICRIS)
Get a list of publications for all researchers, and write it into the `researchers_bibliography.csv` file:
```
node sicris.js
```
An example of `researchers_bibliography.csv` file:
```
reasercher1,bibliography1,bibliography2,bibliography3
researcher2,bibliography2,bibliography4,bibliography5
researcher3,bibliography3,bibliography6,bib7
```

# Get data about each bibliography (COBISS)
Get the title, summary, and year of each bibliography:
```
node cobiss.js
```
The script uses `researcher_bibliography.csv` file obtained in the previous step.
The result is saved into `bibliography.ldjson` file each line of the file has bibliography_id, space delimiter and json object containing other data for the bibliography. An example:
```
bibliography1 {id:bibliography1, title:"bib1 title", year:2020}
bibliography2 {id:bibliography2, title:"bib2 title", year:2021}
bibliography3 {id:bibliography3, title:"bib3 title", year:2022}
```

# Create edge-list with year of the edge

Create an edge list with the year of the edge:
```
node --max-old-space-size=4096 to_graph.js > ./data/g_rsr_bybib_year.csv
``` 
The script uses `researchers_bibliography.csv` and `bibliography.ldjson` files. An example:
```
researcher1 researcher2 2020
researcher2 researcher3 2021
researcher1 researcher3 2022
```

# Rename nodes with 0-based index

Create a new edge list with renamed nodes, such that the smallest index is 0 and the largest is N-1. The scripts outputs the new edge list (graph_zero_index.csv), as well as the node name mapping (nodeid_mapping.csv). It requires `./data/g_rsr_bybib_year_sort.csv` file for the input.

```
node edgelist_rename.js
```

output (graph_zero_index.csv):
```
0,1,-1
0,1,-1
0,2,-1
0,2,-1
```

output (graph_zero_index.csv):
```
0,1,-1
0,1,-1
0,2,-1
0,2,-1
```
output (nodeid_mapping.csv):
```
00001,0
00051,1
00058,2
00086,3
00094,4
```
