declare type Accession = string;

declare type GenomesSearch = Search<Accession>;

interface Genome {
  id: number;
  worker_id: number;
  accession: string;
  version: string;
  version_number: number;
  genbank_accession?: string;
  genbank_version?: string;
  taxonomy_id?: number;
  name: string;
  refseq_category?: string;
	bioproject?: string;
	biosample?: string;
	wgs_master?: string;
	isolate?: string;
	version_status?: string;
	assembly_level?: string;
	release_type?: string;
	release_date?: number;
	assembly_name?: string;
	submitter?: string;
	ftp_path?: string;
	superkingdom?: string;
	phylum?: string;
	class?: string;
	orderr?: string;
	family?: string;
	genus?: string;
	species?: string;
  strain?: string;
  stats: object;
  created_at: number;
  updated_at: number;
}
