import type { WeekContent } from '../core/types';
import { sequenceContract } from '../content/authoring';
export const week03: WeekContent = {
  number: 3, module: 1,
  title: 'Unsupervised Learning: K-Means',
  summary: 'Discover patterns through distance and centroid iteration.',
  topics: ['Euclidean distance', 'Centroids', 'K-Means convergence'],
  visual: 'clusters',
  status: 'planned',
  sequences: [
    sequenceContract('w03-s01','See the Space','Understand 2D data and Euclidean distance',['numeric','choice'],'euclidean/squared distances',5,'Tie between nearest centroids'),
    sequenceContract('w03-s02','Choose Initial Centers','Place valid initial centroids',['parameters','choice'],'validate center count and coordinates',5,'Bad initialization'),
    sequenceContract('w03-s03','Assign Points','Assign each point to the nearest center',['sort','connect','numeric'],'nearest-center deterministic ties',6,'Voronoi boundary'),
    sequenceContract('w03-s04','Update Centroids','Recompute cluster centers from assignments',['numeric','order'],'arithmetic mean per cluster',6,'Empty clusters'),
    sequenceContract('w03-s05','Iterate to Convergence','Execute and inspect Lloyd iterations',['trace','parameters'],'k-means trace and convergence',6,'Local optima'),
    sequenceContract('w03-s06','Clustering Checkpoint','Group a dataset and evaluate the result',['parameters','trace','numeric'],'run complete clustering, inertia and silhouette checks',2,'Compare different K values')
  ],
  puzzles: [] // Parallel content-authoring slot. Do not label as playable until validated.
};
