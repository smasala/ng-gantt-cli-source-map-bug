import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { Gantt, ProjectModel, Panel } from 'bryntum-gantt/gantt.umd.js';

interface ProcessItems {
  taskRecord: { isMilestone: boolean };
  items: { convertToMilestone: boolean };
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements AfterViewInit {
  public constructor(private elementRef: ElementRef) {}

  public ngAfterViewInit(): void {
    const project = new ProjectModel({
      transport: {
        load: {
          url: 'mock/bryntum-data.json',
        },
      },
    });
    const gantt = new Gantt({
      ...{
        startDate: '2019-01-12',
        endDate: '2019-03-24',
        resourceImageFolderPath: 'assets/images/users/',
        dependencyIdField: 'wbsCode',
        columns: [{ type: 'wbs' }, { type: 'name', width: 250 }, { type: 'startdate' }, { type: 'duration' }, { type: 'addnew' }],
      
        subGridConfigs: {
          locked: {
            flex: 3,
          },
          normal: {
            flex: 4,
          },
        },
      
        columnLines: false,
      
        features: {
          rollups: {
            disabled: true,
          },
          baselines: {
            disabled: true,
          },
          progressLine: {
            disabled: true,
            statusDate: new Date(2019, 0, 25),
          },
          taskMenu: {
            // Our items is merged with the provided defaultItems
            // So we add the provided convertToMilestone option.
            items: {
              convertToMilestone: true,
            },
            processItems: (processItems: ProcessItems) => {
              if (processItems.taskRecord.isMilestone) {
                processItems.items.convertToMilestone = false;
              }
            },
          },
          timeRanges: {
            showCurrentTimeLine: true,
          },
          labels: {
            left: {
              field: 'name',
              editor: {
                type: 'textfield',
              },
            },
          },
        },
      },
      project,
    });
    const config = {
      appendTo: this.elementRef.nativeElement,
      items: [gantt],
    };

    // panel renders to this component's element
    new Panel(config);

    project.load({}).then(() => {
      const stm = gantt.project.stm;
      stm.enable();
      stm.autoRecord = true;
    });
  }
}
