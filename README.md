# CloudNeRF
Browser based UI for runnig mulitple NeRF models on a Google Cloud Server

For more detailed information of the app see `cloudnerf-nextjs/README.md`

#### Proposed workflow

-  Select dataset / Upload media and generate dataset from media
-  Select model and settings
-  Generate Results (there are example results already)

-  Generate Evaluation View:
	- Side-by-side view (select image/video/mesh of results)
	- Matrix (select image/video/mesh of results of each dataset and model)
	- Graph (select metric value *if there are any* of results) optional

==Noah will program: Example of UI to generate evaluation view.==

### Next steps:

#### Evaluation
- Running models on AWS machine
	- [ ] InstantNGP
	- [ ] Neus2
	- [ ] Neuralangelo (optional)
	- [ ] D-NeRF (optional)
	- [ ] Gaussian splatting (optional)
	- [ ] Gausian splatting 4d (optional)
- Generating results of datasets
	- [ ] choosing datasets
	- [ ] choosing datatypes for comparison
	- [ ] generating example results

#### Application
- Develop Frontend
	- [ ] Upload / selection of datasets page
	- [ ] Results page (with button to generate results)
		- (New result -> Select dataset and model  and maybe settings -> generate new result)
	- [ ] Evaluation page (with button to generate evaluation view)
		- (New Evaluation view -> Select type of view (side-by-side) -> select results to evaluate -> generate evaluation view)
- Develop Backend
	- [ ] Choose and set up database
	- [ ] Design and write API interface
