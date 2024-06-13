import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { DatePipe } from "@angular/common";
import { MessagesPopups } from "@app/helpers/messagesPopups";
import { Observable, firstValueFrom, map, startWith } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { format } from "date-fns";
import { PrinciplesService } from "@app/services/principles.service";
import { NgZone } from "@angular/core";
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
} from "ng-apexcharts";
import { MaterialModule } from "@app/material.module";
import { GraphicModel } from "@app/models/graphic";
import { GraphicService } from "@app/services/graphic.service";
import { ShareDataService } from "@app/services/share-data.service";
import { ObjectiveValuesService } from "@app/services/objective-values.service";
import { S3Service } from "@app/services/s3.service";
import html2canvas from "html2canvas";

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
  idobjetivevalue: number;
  commentario: string;
  graficotipo: string | null;
  graficocontenido: string;
  is_complete: boolean;
}
@Component({
  selector: "app-graphics",
  templateUrl: "./graphics.component.html",
  styleUrls: ["./graphics.component.scss"],
})
export class GraphicsComponent {
  @ViewChild("chart") chart: ChartComponent = Object.create(null);
  // @ViewChild('chartComponent') chartComponent: any;
  @ViewChild("donaChartComponent", { static: false })
  donaChartComponent: ElementRef;
  @ViewChild("pieChartComponent", { static: false })
  pieChartComponent: ElementRef;
  @ViewChild("columnChartComponent", { static: false })
  columnChartComponent: ElementRef;
  @ViewChild("radialChartComponent", { static: false })
  radialChartComponent: ElementRef;
  @ViewChild("barChartComponent", { static: false })
  barChartComponent: ElementRef;

  public radialbarChartOptions: Partial<ChartOptions> | any;
  public doughnutChartOptions: Partial<ChartOptions> | any;
  public pieChartOptions: Partial<ChartOptions> | any;
  public columnChartOptions: Partial<ChartOptions> | any;
  public barChartOptions: Partial<ChartOptions> | any;

  loading: boolean = false;
  loading2: boolean = false;
  id: any;
  charElemet: any;
  local_data: GraphicModel = new GraphicModel();
  local_data_save: any = {};
  graphic_data: any = {};
  plot_type: any = 0;
  comment: string = "";
  is_average: boolean = false;
  comment2: string = "";
  urlImage: string = "";
  selectedOption: number | null = null;
  selectedFile: File | undefined;

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
    public objectiveValueService: ObjectiveValuesService,
    public messagesPopups: MessagesPopups,
    public route: Router,
    activatedRouter: ActivatedRoute,
    private shareDataService: ShareDataService,
    private _s3Service: S3Service,
    private sharedDataService: ShareDataService,
    private ngZone: NgZone
  ) {
    this.id = activatedRouter.snapshot.paramMap.get("id");
  }

  async ngOnInit(): Promise<void> {
    await this.getGraphicIndicatorData();
    this.initializeTopCards();
    this.initializeDoughnutChartOptions();
  }

  private initializeTopCards(): void {
    this.topcards = [
      {
        id: 1,
        color: "primary",
        img: "/assets/images/svgs/icon-user-male.svg",
        title: this.local_data.descripcion_denominador,
        subtitle: this.local_data.valor_denominador,
      },
      {
        id: 2,
        color: "warning",
        img: "/assets/images/svgs/icon-briefcase.svg",
        title: this.local_data.descripcion_numerador,
        subtitle: this.local_data.valor_numerador,
      },
      {
        id: 3,
        color: "accent",
        img: "/assets/images/svgs/icon-mailbox.svg",
        title: this.local_data.variablesgrafico[0],
        subtitle: this.local_data.resultado_grafico[0],
      },
      {
        id: 4,
        color: "success",
        img: "/assets/images/svgs/icon-speech-bubble.svg",
        title: this.local_data.descripcionindicador,
        subtitle: this.local_data.resultado_indicador + "%",
      },
      {
        id: 5,
        color: "error",
        img: "/assets/images/svgs/icon-favorites.svg",
        title: this.local_data.variablesgrafico[1],
        subtitle: this.local_data.resultado_grafico[1] + "%",
      },
      {
        id: 6,
        color: "success",
        img: "/assets/images/svgs/icon-speech-bubble.svg",
        title:
          this.local_data.logica === "greater_than"
            ? "Meta > "
            : this.local_data.logica === "equal_greater_than"
            ? "Meta >= "
            : this.local_data.logica === "equal"
            ? "Meta = "
            : this.local_data.logica === "equal_less_than"
            ? "Meta <= "
            : this.local_data.logica === "less_than"
            ? "Meta < "
            : "Meta",

        subtitle: this.local_data.meta + "%",
      },
      {
        id: 7,
        color: "primary",
        img: "/assets/images/svgs/icon-tasks.svg",
        title: "Cumplimiento",
        subtitle: this.local_data.cumplimiento ? "SI" : "NO",
      },
    ];
  }

  private initializeDoughnutChartOptions() {
    // Your doughnut chart options initialization logic

    this.doughnutChartOptions = {
      series: [
        parseFloat(this.local_data.valor_numerador),
        parseFloat(this.local_data.resultado_grafico[0]),
      ],
      chart: {
        id: "donut-chart",
        type: "donut",
        height: 350,
        fontFamily: "'Plus Jakarta Sans',sans-serif",
        foreColor: "#000000",
        toolbar: {
          show: false,
        },
      },
      labels: [
        this.local_data.descripcionindicador +
          ` (${this.local_data.resultado_indicador}%)`,
        this.local_data.variablesgrafico[1] +
          ` (${this.local_data.resultado_grafico[1]}%)`,
      ],
      dataLabels: {
        enabled: true,

        formatter: function (value: any) {
          // Formatear el valor del tooltip con 2 decimales
          return parseFloat(value).toFixed(2)+"%";
        },
        style: {
          fontSize: "15px",
        },
      },
      plotOptions: {
        pie: {
          donut: {
            size: "60px",
          },
        },
      },
      legend: {
        show: true,
        position: "bottom",
        width: "50px",
        fontFamily: "'Plus Jakarta Sans',sans-serif",
        fontSize: "14px",
      },
      colors: ["#2540DF", "#FFA347", "#ECF2FF", "#E8F7FF"],
      tooltip: {
        theme: "dark",
        fillSeriesColor: false,
      },
    };
  }
  private initializeBarChartOptions() {
    this.barChartOptions = {
      series: [
        {
          name:
            this.local_data.descripcionindicador +
            ` (${this.local_data.resultado_indicador}%)`,
          data: [this.local_data.resultado_indicador],
        },
        {
          name:
            this.local_data.variablesgrafico[1] +
            ` (${this.local_data.resultado_grafico[1]}%)`,
          data: [this.local_data.resultado_grafico[1]],
        },
      ],
      colors: ["#2540DF", "#FFA000", "#FFF833", "#E8F7FF"],
      chart: {
        height: 340,
        type: "bar",
        fontFamily: "'Plus Jakarta Sans',sans-serif",
        foreColor: "#000000",
        toolbar: {
          show: false,
        },
      },
      labels: ["", ""],
      plotOptions: {
        bar: {
          dataLabels: {
            position: "top", // top, center, bottom
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: any) {
          return val + "%";
        },
        offsetY: -20,
        style: {
          fontSize: "15px",
          colors: ["#304758"],
        },
      },
      legend: {
        show: true,
        position: "bottom",
        width: "50px",
        fontFamily: "'Plus Jakarta Sans',sans-serif",
        fontSize: "15px",
      },
      xaxis: {
        categories: [this.local_data.descripcion_denominador],
        position: "top",
        labels: {
          offsetY: -18,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },

        crosshairs: {
          fill: {
            type: "gradient",
            gradient: {
              colorFrom: "#D8E3F0",
              colorTo: "#BED1E6",
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            },
          },
        },
        tooltip: {
          enabled: true,
          offsetY: -35,
        },
      },

      yaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: true,
          formatter: function (val: any) {
            return val + "%";
          },
          style: {
            colors: ["#000000"], // Cambia el color del texto del eje Y
            fontSize: "15px", // Cambia el tamaño del texto del eje Y
          },
        },
        
      },
      title: {
        text: "",
        floating: 0,
        offsetY: 320,
        align: "center",
        style: {
          color: "#444",
        },
      },
    };
  }
  private initializePieChartOptions() {
    // Your pie chart options initialization logic
    this.pieChartOptions = {
      series: [
        parseFloat(this.local_data.valor_numerador),
        parseFloat(this.local_data.resultado_grafico[0]),
      ],
      chart: {
        id: "pie-chart",
        type: "pie",
        height: 350,
       
        fontFamily: "'Plus Jakarta Sans',sans-serif",
        foreColor: "#000000",
        toolbar: {
          show: false,
        },
        
      },
      labels: [
        this.local_data.descripcionindicador +
          ` (${this.local_data.resultado_indicador}%)`,
        this.local_data.variablesgrafico[1] +
          ` (${this.local_data.resultado_grafico[1]}%)`,
      ],

      dataLabels: {
        enabled: true,
        formatter: function (value: any) {
          // Formatear el valor del tooltip con 2 decimales
          return parseFloat(value).toFixed(2)+"%";
        },
        style: {
          fontSize: "15px",
        },
        
      },
      plotOptions: {
        pie: {
          donut: {
            size: "100px",
          },
          dataLabels: {
            position: "center", // top, center, bottom
          },
        },
      },
      legend: {
        show: true,
        position: "bottom",
        width: "50px",
        fontFamily: "'Plus Jakarta Sans',sans-serif",
        fontSize: "14px",
      },
      colors: ["#2540DF", "#FFA347", "#E8F7FF", "#ECF2FF", "#49BEFF"],
      tooltip: {
        fillSeriesColor: false,
      },
    };
  }

  private initializeColumnChartOptions() {
    this.columnChartOptions = {
      series: [
        {
          name:
            this.local_data.descripcionindicador +
            ` (${this.local_data.resultado_indicador}%)`,
          data: [this.local_data.valor_numerador],
        },
        {
          name:
            this.local_data.variablesgrafico[1] +
            ` (${this.local_data.resultado_grafico[1]}%)`,
          data: [this.local_data.resultado_grafico[0]],
        },
      ],

      chart: {
        height: 340,
        type: "bar",
        stacked: true,
        toolbar: {
          show: false,
        },
        fontFamily: "'Plus Jakarta Sans',sans-serif",
        foreColor: "#000000",
      },
      plotOptions: {
        bar: {
          columnWidth: "40%",
          barHeight: "40%",
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: "15px",
        },
      },
      markers: {
        size: 3,
      },
      stroke: {
        curve: "straight",
        width: "0",
      },
      colors: ["#2540DF", "#FFA347", "#FFF833", "#E8F7FF"],
      legend: {
        show: true,
        fontFamily: "'Plus Jakarta Sans',sans-serif",
        fontSize: "15px",
      },
      grid: {
        show: true,
        strokeDashArray: 0,
        borderColor: "rgba(0,0,0,0.1)",
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: false,
          },
        },
      },
      xaxis: {
        type: "category",
        categories: [this.local_data.descripcion_denominador],
        labels: {
          show: true,
          
          style: {
            colors: ["#000000"], // Cambia el color del texto del eje Y
            fontSize: "15px", // Cambia el tamaño del texto del eje Y
          },
        },
      },
      yaxis:{
        labels: {
          show: true,
          
          style: {
            colors: ["#000000"], // Cambia el color del texto del eje Y
            fontSize: "15px", // Cambia el tamaño del texto del eje Y
          },
        },
      },
      tooltip: {
        theme: "dark",
      },
    };
  }
  private initializeRadialbarChartOptions() {
    this.radialbarChartOptions = {
      series: [
        this.local_data.resultado_indicador,
        this.local_data.resultado_grafico[1],
      ],
      labels: [
        this.local_data.descripcionindicador +
          ` (${this.local_data.resultado_indicador}%)`,
        this.local_data.variablesgrafico[1] +
          ` (${this.local_data.resultado_grafico[1]}%)`,
      ],

      chart: {
        id: "radial-chart",
        type: "radialBar",
        height: 350,
        fontFamily: "'Plus Jakarta Sans',sans-serif",
        foreColor: "#000000",
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: any, opt: any) {
          return val + "%";
        },
        style: {
          fontSize: "14px",
        },
      },
      legend: {
        show: true,
        position: "bottom", // Coloca la leyenda debajo del gráfico
        horizontalAlign: "center", // Ajusta la alineación horizontal
        fontFamily: "'Plus Jakarta Sans',sans-serif",
        fontSize: "14px",
      },
      colors: ["#2540DF", "#FFAE1F"],
      plotOptions: {
        radialBar: {
          dataLabels: {
            enabled: true,
            name: {
              fontSize: "15px",
            },
            value: {
              fontSize: "15px",
            },

            total: {
              show: true,
              label: "Total",
              formatter: () => {
                // Ahora, 'this' apunta al contexto correcto
                return this.local_data.valor_denominador || "-";
              },
            },
          },
        },
      },
      tooltip: {
        theme: "dark",
      },
    };
  }

  convertirNumero(valor: any) {
    if (!isNaN(valor)) {
      if (Number.isInteger(parseFloat(valor))) {
        return parseInt(valor);
      } else {
        return parseFloat(valor).toFixed(2);
      }
    } else {
      return valor;
    }
  }

  async getGraphicIndicatorData() {
    try {
      this.loading = true;

      // Fetch data from the service
      this.graphic_data = await firstValueFrom(
        this.graphicService.getDataById(this.id)
      );
      this.local_data = this.graphic_data.data;
      console.log(this.local_data);

      this.local_data.resultado_indicador = this.convertirNumero(
        this.local_data.resultado_indicador
      );
      this.local_data.valor_numerador = this.convertirNumero(
        this.local_data.valor_numerador
      );
      this.local_data.valor_denominador = this.convertirNumero(
        this.local_data.valor_denominador
      );
      this.local_data.resultado_grafico[0] = this.convertirNumero(
        this.local_data.resultado_grafico[0]
      );
      this.local_data.resultado_grafico[1] = this.convertirNumero(
        this.local_data.resultado_grafico[1]
      );
      this.local_data.meta = this.convertirNumero(this.local_data.meta);

      this.local_data.descripcionindicador
        .toLocaleLowerCase()
        .includes("promedio")
        ? (this.is_average = true)
        : (this.is_average = false);
      const tiposDeGrafico: any = {
        Dona: 1,
        Pastel: 2,
        Columna: 3,
        Radialbar: 4,
        Barra: 5,
      };

      this.selectedOption = this.local_data.graficotipo
        ? tiposDeGrafico[this.local_data.graficotipo]
        : 1;
      this.changePlot(this.selectedOption);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      this.loading = false;
    }
  }

  backPrinciple() {
    this.route.navigate([`/report/principle-${this.local_data.idprincipio}`]);
    this.sharedDataService.setSharedValue(this.local_data.idclasificacion);
  }

  changePlot(type: any) {
    this.plot_type = type;
    if (this.plot_type === 1) {
      this.initializeDoughnutChartOptions();
      this.selectedOption = 1;
    }
    if (this.plot_type === 2) {
      this.initializePieChartOptions();
      this.selectedOption = 2;
    }
    if (this.plot_type === 3) {
      this.initializeColumnChartOptions();
      this.selectedOption = 3;
    }
    if (this.plot_type === 4) {
      this.initializeRadialbarChartOptions();
      this.selectedOption = 4;
    }
    if (this.plot_type === 5) {
      this.initializeBarChartOptions();
      this.selectedOption = 5;
    }
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

  setChartNative(option: any) {
    switch (option) {
      case 1:
        this.charElemet = this.donaChartComponent.nativeElement;
        break;
      case 2:
        this.charElemet = this.pieChartComponent.nativeElement;
        break;
      case 3:
        this.charElemet = this.columnChartComponent.nativeElement;
        break;
      case 4:
        this.charElemet = this.radialChartComponent.nativeElement;
        break;
      case 5:
        this.charElemet = this.barChartComponent.nativeElement;
        break;
      default:
        console.error("Invalid option");
        return;
    }
  }

  async downloadChartAsFile() {
    if (!this.selectedOption) {
      return this.messagesPopups.popupMessage(
        "Seleccione un gráfico antes de Guardar"
      );
    }
    this.loading2 = true;
    this.plot_type = this.selectedOption;

    this.setChartNative(this.selectedOption);

    html2canvas(this.charElemet, {
      scale: 2, // Escala de la imagen
      logging: false,
      allowTaint: false,
    }).then((canvas: any) => {
      const fechaActual = new Date();
      const año = fechaActual.getFullYear();
      const mes = String(fechaActual.getMonth() + 1).padStart(2, "0");
      const dia = String(fechaActual.getDate()).padStart(2, "0");
      const horas = String(fechaActual.getHours()).padStart(2, "0");
      const minutos = String(fechaActual.getMinutes()).padStart(2, "0");
      const segundos = String(fechaActual.getSeconds()).padStart(2, "0");
      const fechaFormateada = `${año}-${mes}-${dia}-${horas}${minutos}${segundos}`;
      const nombreArchivo = `chart-${fechaFormateada}.png`;
      canvas.toBlob((blob: any) => {
        this.selectedFile = new File([blob], nombreArchivo, {
          type: "image/png",
        });
        this.uploadFile();
      });
    });
  }

  uploadFile() {
    return new Promise((resolve, reject) => {
      if (this.selectedFile) {
        this._s3Service
          .uploadFile(this.selectedFile)
          .then((url: any) => {
            this.urlImage = url;
            console.log("Archivo subido con éxito. URL:", url);
            resolve(url);
          })
          .catch((error) => {
            console.error("Error al subir el archivo:", error);
            reject(error);
          });
      } else {
        resolve(null);
      }
    }).then(() => {
      this.formarLocalData();
    });
  }

  formarLocalData() {
    const tiposGrafico = ["Dona", "Pastel", "Columna", "Radialbar", "Barra"];
    const graficoSeleccionado = this.selectedOption
      ? tiposGrafico[this.selectedOption - 1]
      : null;

    const localData: LocalData = {
      idobjetivevalue: this.id,
      commentario: this.local_data.commentario,
      graficotipo: graficoSeleccionado,
      graficocontenido: this.urlImage,
      // graficocontenido: 'img',
      is_complete:
        this.selectedOption && this.local_data.commentario ? true : false,
    };
    this.local_data_save = localData;
    this.saveDataGraph();
  }

  saveDataGraph() {
    this.objectiveValueService.update(this.local_data_save).subscribe(
      (data) => {
        if (data.message == "success") {
          this.local_data_save = {};
          this.messagesPopups.popupMessage(data.message);
          this.ngZone.run(() => {
            setTimeout(() => {
              this.route.navigate([
                `/report/principle-${this.local_data.idprincipio}`,
              ]);
            }, 500);
          });
          this.sharedDataService.setSharedValue(
            this.local_data.idclasificacion
          );
        } else {
          this.messagesPopups.popupMessage("Error: " + data.message);
        }
        this.loading2 = false;
      },
      (error) => {
        this.loading2 = false;
        this.messagesPopups.popupMessage("Error al obtener datos: " + error);
        console.error("Error al obtener datos:", error);
      }
    );
  }
}
