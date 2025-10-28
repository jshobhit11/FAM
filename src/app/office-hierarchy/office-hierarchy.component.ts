import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-office-hierarchy',
  templateUrl: './office-hierarchy.component.html',
  styleUrls: ['./office-hierarchy.component.scss'],
})
export class OfficeHierarchyComponent implements OnInit {
  nodes: TreeNode[] = [];
  selected: any;

  ngOnInit() {
    this.nodes = [
      {
        label: 'Select Office',
        icon: 'pi pi-folder',
        children: [
          {
            label: 'E1 PILLANNA GARDEN',
            icon: 'pi pi-file',
          },
          {
            label: 'BENSON TOWN OMU',
            icon: 'pi pi-file',
          },
          {
            label: 'FRAZER TOWN OMU',
            icon: 'pi pi-file',
          },
          {
            label: 'VENKATESHPURA OMU',
            icon: 'pi pi-file',
          },
        ],
      },
      {
        label: 'Home',
        icon: 'pi pi-folder',
        children: [
          {
            label: 'grocery.word',
            icon: 'pi pi-file',
          },
          {
            label: 'picture.jpeg',
            icon: 'pi pi-file',
          },
          {
            label: 'homeplan.png',
            icon: 'pi pi-file',
          },
        ],
      },
      {
        label: 'Multimedia',
        icon: 'pi pi-folder',
        children: [
          {
            label: 'infinity-war.mp4',
            icon: 'pi pi-file',
          },
          {
            label: 'you.mp3',
            icon: 'pi pi-file',
          },
          {
            label: 'endgame.mp4',
            icon: 'pi pi-file',
          },
          {
            label: 'MI.mp4',
            icon: 'pi pi-file',
          },
        ],
      },
    ];
  }
}
