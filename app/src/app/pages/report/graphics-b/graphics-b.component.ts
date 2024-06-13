import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MessagesPopups } from '@app/helpers/messagesPopups';
import { Observable, firstValueFrom, map, startWith } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { format } from 'date-fns';
import { PrinciplesService } from '@app/services/principles.service';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexYAxis,
  ApexLegend,
  ApexXAxis,
  ApexTooltip,
  ApexTheme,
  ApexGrid,
  ApexPlotOptions,
  ApexFill,
  NgApexchartsModule,
  ApexResponsive,
} from 'ng-apexcharts';
import { MaterialModule } from '@app/material.module';
import { GraphicModel } from '@app/models/graphic';
import { GraphicService } from '@app/services/graphic.service';
import { ObjectiveValuesService } from '@app/services/objective-values.service';
import { ShareDataService } from '@app/services/share-data.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: any;
  theme: ApexTheme;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  colors: string[];
  markers: any;
  grid: ApexGrid;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  labels: string[];
  responsive: ApexResponsive[];
};

interface Charts {
  doughnutChartChecked: boolean;
  pieChartChecked: boolean;
  radialbarChartChecked: boolean;
  barChartChecked: boolean;
  columnChartChecked: boolean;
}
interface topcards {
  id: number;
  img: string;
  color: string;
  title: string;
  subtitle: number | string;
}
interface LocalData {
  idobjetivevalue:number;
  commentario: string;
  graficotipo: string | null;
  graficocontenido: string;
  is_complete: boolean;
}
@Component({
  selector: 'app-graphics-b',
  templateUrl: './graphics-b.component.html',
  styleUrls: ['./graphics-b.component.scss']
})
export class GraphicsBComponent {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  public radialbarChartOptions: Partial<ChartOptions> | any;
  public doughnutChartOptions: Partial<ChartOptions> | any;
  public pieChartOptions: Partial<ChartOptions> | any;
  public columnChartOptions: Partial<ChartOptions> | any;
  public barChartOptions: Partial<ChartOptions> | any;
  ;

  loading: boolean = false;
  loading2: boolean = false;
  id: any;
  local_data: GraphicModel = new GraphicModel();
  graphic_data: any = {};
  plot_type: number = 0;
  comment: string = '';
  is_average: boolean = false;
  comment2: string = '';
  selectedOption: number | null = null;
  local_data_save:any={}

  topcards: topcards[] = [];
  topcards2: topcards[] = [];
  topcards3: topcards[] = [];

  chartSettings: Charts = {
    doughnutChartChecked: false,
    pieChartChecked: false,
    radialbarChartChecked: false,
    barChartChecked: false,
    columnChartChecked: false,
  };
  constructor(
    public datePipe: DatePipe,
    public graphicService: GraphicService,
    public messagesPopups: MessagesPopups,
    public route: Router,
    activatedRouter: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    public objectiveValueService: ObjectiveValuesService,
    private sharedDataService: ShareDataService



  ) {
    this.id = activatedRouter.snapshot.paramMap.get('id');


  }
  async ngOnInit(): Promise<void> {

    await this.getGraphicIndicatorData();


      this.initializeTopCards2();
    
  }

  formarLocalData(): LocalData | void {
    // Validar campos requeridos
    // if (!this.comment || !this.selectedOption) {
    //   this.messagesPopups.popupMessage('Completar campos');
    //   return;
    // }
  
    // Mapear selectedOption al tipo de gráfico correspondiente
    const tiposGrafico = ['Dona', 'Pastel', 'Columna', 'Radialbar', 'Barra'];
    const graficoSeleccionado = this.selectedOption?  tiposGrafico[this.selectedOption - 1]:null;
  
    // Construir el objeto localData
    const localData: LocalData = {
      idobjetivevalue: this.id,
      commentario: this.local_data.commentario,
      graficotipo: graficoSeleccionado,
      graficocontenido: 'graafico_conetindo',
      is_complete: this.local_data.commentario?  true :false // No es necesario comprobar de nuevo si los campos están presentes, ya que la validación se realizó anteriormente
    };
  
    return localData;
  }
  saveDataGraph(){

    this.loading2 = true;
    this.local_data_save = this.formarLocalData();
    this.objectiveValueService.update(this.local_data_save).subscribe(
      data => {
        if (data.message == 'success') {
          this.local_data_save = {};
          this.messagesPopups.popupMessage(data.message);
          this.route.navigate([`/report/principle-${this.local_data.idprincipio}`]);
          this.sharedDataService.setSharedValue(this.local_data.idclasificacion);
          this.loading2 = false;

        } else {
          this.messagesPopups.popupMessage('Error: ' + data.message);
          this.loading2 = false;
        }
      },
      (error) => {
        this.messagesPopups.popupMessage('Error al obtener datos: ' + error);
        console.error('Error al obtener datos:', error);
        this.loading2 = false;

      }
    );

  }
  private initializeTopCards2(): void {
    this.topcards2 = [

      {
        id: 1,
        color: 'warning',
        img: '/assets/images/svgs/icon-briefcase.svg',
        title: this.local_data.descripcion_numerador,
        subtitle: this.local_data.valor_numerador,
      },

      {
        id: 2,
        color: 'success',
        img: '/assets/images/svgs/icon-speech-bubble.svg',
        title: this.local_data.operacion==='Igual'?(this.local_data.logica === 'greater_than' ? 'Meta > ':
        this.local_data.logica === 'equal_greater_than' ? 'Meta >= ':
        this.local_data.logica === 'equal' ? 'Meta = ':
        this.local_data.logica === 'equal_less_than' ? 'Meta <= ':
        this.local_data.logica === 'less_than' ? 'Meta < ':'Meta')  :this.local_data.meta,
        subtitle: this.local_data.meta,
        // subtitle: this.local_data.meta,
      },
      
      {
        id: 3,
        color: 'primary',
        img: '/assets/images/svgs/icon-tasks.svg',
        title: 'Cumplimiento',
        subtitle: this.local_data.cumplimiento ? 'SI'  : 'NO',

      },

    ];
  }



  convertirNumero(valor: any) {
    if (!isNaN(valor)) {
      if (Number.isInteger(parseFloat(valor))) {
        return parseInt(valor);
      } else {
        return parseFloat(valor).toFixed(2);
      }
    } else {
      return valor;  // Puedes retornar el valor original o manejarlo de otra manera según tus necesidades
    }
  }

  async getGraphicIndicatorData() {
    try {
      this.loading = true;
      // Fetch data from the service
      this.graphic_data = await firstValueFrom(this.graphicService.getDataById(this.id));
      this.local_data = this.graphic_data.data;
      
        this.local_data.resultado_indicador = this.convertirNumero(this.local_data.resultado_indicador);
        this.local_data.valor_numerador = this.convertirNumero(this.local_data.valor_numerador);
        this.local_data.valor_denominador = this.convertirNumero(this.local_data.valor_denominador);
        this.local_data.resultado_grafico[0] = this.convertirNumero(this.local_data.resultado_grafico[0]);
        this.local_data.resultado_grafico[1] = this.convertirNumero(this.local_data.resultado_grafico[1]);
        this.local_data.meta = this.convertirNumero(this.local_data.meta);
        this.local_data.descripcionindicador.toLocaleLowerCase().includes('promedio')? this.is_average= true : this.is_average= false
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      this.loading = false;
    }
  }


  backPrinciple() {
    this.route.navigate([`/report/principle-${this.local_data.idprincipio}`]);
    this.sharedDataService.setSharedValue(this.local_data.idclasificacion);
  }


  setCheck(chartOption: number) {
    if (this.selectedOption === chartOption) {
      // Si la opción seleccionada es la misma, deseleccionarla
      this.selectedOption = null;
    } else {
      // Si la opción seleccionada es diferente, seleccionarla
      this.selectedOption = chartOption;
    }
  }
  
}
