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
import html2canvas from "html2canvas";

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
import { ObjectiveValuesService } from "@app/services/objective-values.service";
import { ShareDataService } from "@app/services/share-data.service";
import { S3Service } from "@app/services/s3.service";

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
  selector: "app-graphics-c",
  templateUrl: "./graphics-c.component.html",
  styleUrls: ["./graphics-c.component.scss"],
})
export class GraphicsCComponent {
  @ViewChild("chart") chart: ChartComponent = Object.create(null);
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
  local_data: GraphicModel = new GraphicModel();
  graphic_data: any = {};
  plot_type: number = 0;
  comment: string = "";
  is_average: boolean = false;
  comment2: string = "";
  selectedOption: number | null = null;
  local_data_save: any = {};
  urlImage: string = "";
  selectedFile: File | undefined;
  charElemet: any;

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
    private sharedDataService: ShareDataService,
    private ngZone: NgZone,
    private _s3Service: S3Service
  ) {
    this.id = activatedRouter.snapshot.paramMap.get("id");
  }
  async ngOnInit(): Promise<void> {
    await this.getGraphicIndicatorData();
    this.initializeTopCards3();
    // this.initializeBarChartOptions2()
    this.local_data.relacionproporcion === "Promedio_Procentaje"
      ? this.initializeBarChartOptions2()
      : this.local_data.relacionproporcion === "Promedio"
      ? this.initializeBarChartOptions()
      : this.initializeBarChartOptions3();
    this.plot_type = 5;
    this.selectedOption = 5;
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
      logging: true,
      allowTaint: true,
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
            this.messagesPopups.popupMessage("Error al subir archivo");
            this.loading2 = false;
            reject(error);
          });
      } else {
        resolve(null);
      }
    }).then(() => {
      this.formarLocalData();
    });
  }
  formarLocalData(): LocalData | void {
    // Mapear selectedOption al tipo de gráfico correspondiente
    const tiposGrafico = ["Dona", "Pastel", "Columna", "Radialbar", "Barra"];
    const graficoSeleccionado = this.selectedOption
      ? tiposGrafico[this.selectedOption - 1]
      : null;

    // Construir el objeto localData
    const localData: LocalData = {
      idobjetivevalue: this.id,
      commentario: this.local_data.commentario,
      graficotipo: graficoSeleccionado,
      graficocontenido: this.urlImage,
      // graficocontenido: 'grafico pro',

      is_complete:
        this.selectedOption && this.local_data.commentario ? true : false, // No es necesario comprobar de nuevo si los campos están presentes, ya que la validación se realizó anteriormente
    };
    this.local_data_save = localData;
    //   setTimeout(() => {
    this.saveDataGraph();
  }

  saveDataGraph() {
    this.loading2 = true;
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
          this.loading2 = false;
        } else {
          this.messagesPopups.popupMessage("Error: " + data.message);
          this.loading2 = false;
        }
      },
      (error) => {
        this.messagesPopups.popupMessage("Error al obtener datos: " + error);
        console.error("Error al obtener datos:", error);
        this.loading2 = false;
      }
    );
  }

  private initializeTopCards3(): void {
    this.topcards3 = [
      {
        id: 1,
        color: "primary",
        img: "/assets/images/svgs/icon-user-male.svg",
        title: this.local_data.descripcion_numerador,
        // subtitle: this.local_data.unidades_numerador.includes('dolares')? '$'+ this.local_data.valor_numerador : this.local_data.valor_numerador,
        subtitle: this.local_data.unidades_numerador.includes("dolares")
          ? new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(parseFloat(this.local_data.valor_numerador))
          : this.local_data.valor_numerador,
      },
      {
        id: 2,
        color: "error",
        img: "/assets/images/svgs/icon-favorites.svg",
        title: this.local_data.descripcionindicador,
        // subtitle: this.local_data.unidades_indicador.includes('dolares')? '$'+this.local_data.resultado_indicador: this.local_data.unidades_indicador.includes("transacciones")?  this.local_data.resultado_indicador:  this.local_data.resultado_indicador +'%' ,
        subtitle: this.local_data.unidades_indicador.includes("dolares")
          ? new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(parseFloat(this.local_data.resultado_indicador))
          : this.local_data.unidades_indicador.includes("transacciones")
          ? this.local_data.resultado_indicador
          : this.local_data.resultado_indicador + "%",
      },
      {
        id: 3,
        color: "warning",
        img: "/assets/images/svgs/icon-briefcase.svg",
        title: this.local_data.descripcion_denominador,
        // subtitle: this.local_data.unidades_denominador.includes('dolares')? '$'+this.local_data.valor_denominador: this.local_data.valor_denominador,
        subtitle: this.local_data.unidades_denominador.includes("dolares")
          ? new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(parseFloat(this.local_data.valor_denominador))
          : this.local_data.valor_denominador,
      },

      {
        id: 4,
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
        subtitle: this.local_data.unidades_indicador.includes("dolares")
          ? new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(parseFloat(this.local_data.meta))
          : this.local_data.unidades_indicador.includes("transacciones")
          ? this.local_data.meta
          : this.local_data.meta + "%",
      },
      {
        id: 5,
        color: "primary",
        img: "/assets/images/svgs/icon-tasks.svg",
        title: "Cumplimiento",
        subtitle: this.local_data.cumplimiento ? "SI" : "NO",
      },
    ];
  }

  private initializeBarChartOptions() {
    //Promedio

    this.barChartOptions = {
      series: [
        {
          // name: this.local_data.descripcion_numerador + ' ('+this.local_data.resultado_indicador+'% )',
          name: this.local_data.descripcion_numerador,

          data: [this.local_data.valor_numerador],
        },
        {
          name: this.local_data.descripcionindicador,

          data: [this.local_data.resultado_indicador],
        },
      ],
      legend: {
        show: true,
        position: "bottom",
        width: "50px",
        fontFamily: "'Plus Jakarta Sans',sans-serif",
        fontSize: "15px",
      },
      chart: {
        height: 340,
        type: "bar",
        toolbar: {
          show: false, // Puedes ajustar esto según tus necesidades
        },
        fontFamily: "'Plus Jakarta Sans',sans-serif",
        foreColor: "#000000",
      },
      plotOptions: {
        bar: {
          horizontal: false,
          dataLabels: {
            position: "top",
          },
        },
      },
      dataLabels: {
        enabled: true,
        offsetY: -20,
        style: {
          fontSize: "15px",
          colors: ["#000000"],
        },
        // formatter: function (val: any) {
        //   return "$"+ val ;
        // },
        formatter: (val: any, opt: any) => {
          // Verificar si es el primer dato de la serie y agregar "$" solo en ese caso
          if (opt.seriesIndex === 0 && opt.dataPointIndex === 0) {
            return this.local_data.unidades_numerador.includes("dolares")
              ? new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(val)
              : val;
          } else {
            return this.local_data.unidades_denominador.includes("dolares") ||
              this.local_data.unidades_indicador.includes("dolares/socios")
              ? new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(val)
              : val;
          }
        },
      },
      colors: ["#3B6DFF", "#FF9C20"],
      xaxis: {
        categories: [""],
      },
      yaxis: {
        show: true,
        labels: {
          formatter: function (val: any) {
            return "$" + val;
          },

          style: {
            colors: ["#000000"], // Cambia el color del texto del eje Y
            fontSize: "15px", // Cambia el tamaño del texto del eje Y
          },
        },
      },
    };
  }

  private initializeBarChartOptions2() {
    //Promedio_Procentaje

    this.barChartOptions = {
      series: [
        {
          name: this.local_data.descripcion_denominador + " (100%)",
          data: [this.local_data.valor_denominador],
        },
        {
          name:
            this.local_data.descripcion_numerador +
            " (" +
            this.local_data.resultado_indicador +
            "% )",
          // name: this.local_data.descripcion_numerador,

          data: [this.local_data.valor_numerador],
        },
      ],
      legend: {
        show: true,
        position: "bottom",
        width: "50px",
        fontFamily: "'Plus Jakarta Sans',sans-serif",
        fontSize: "15px",
      },
      chart: {
        height: 340,
        type: "bar",
        toolbar: {
          show: false, // Puedes ajustar esto según tus necesidades
        },
        fontFamily: "'Plus Jakarta Sans',sans-serif",
        foreColor: "#000000",
      },
      plotOptions: {
        bar: {
          horizontal: false,
          dataLabels: {
            position: "top",
          },
        },
      },
      dataLabels: {
        enabled: true,
        offsetY: -20,
        style: {
          fontSize: "15px",
          colors: ["#000000"],
        },
        formatter: (val: any, opt: any) => {
          // Verificar si es el primer dato de la serie y agregar "$" solo en ese caso
          if (opt.seriesIndex === 0 && opt.dataPointIndex === 0) {
            return this.local_data.unidades_numerador.includes("dolares")
              ? new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(val)
              : val;
          } else {
            return this.local_data.unidades_denominador.includes("dolares")
              ? new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(val)
              : val;
          }
        },
      },
      colors: ["#FEA224", "#026CDD"],
      xaxis: {
        categories: [""],
      },
      yaxis: {
        show: true,
        labels: {
          formatter: function (val: any) {
            return val;
          },
          style: {
            colors: ["#000000"], // Cambia el color del texto del eje Y
            fontSize: "15px", // Cambia el tamaño del texto del eje Y
          },
        },
      },
    };
  }

  private initializeBarChartOptions3() {
    //Promedio_Division

    this.barChartOptions = {
      series: [
        {
          // name: this.local_data.descripcion_numerador + ' ('+this.local_data.resultado_indicador+'% )',
          name: this.local_data.descripcion_numerador,

          data: [this.local_data.valor_numerador],
        },
        {
          name: this.local_data.descripcion_denominador,

          data: [this.local_data.valor_denominador],
        },
      ],
      legend: {
        show: true,
        position: "bottom",
        width: "50px",
        fontFamily: "'Plus Jakarta Sans',sans-serif",
        fontSize: "15px",
      },
      chart: {
        height: 340,
        type: "bar",
        toolbar: {
          show: false, // Puedes ajustar esto según tus necesidades
        },
        fontFamily: "'Plus Jakarta Sans',sans-serif",
        foreColor: "#000000",
      },
      plotOptions: {
        bar: {
          horizontal: false,
          dataLabels: {
            position: "top",
          },
        },
      },
      dataLabels: {
        enabled: true,
        offsetY: -20,
        style: {
          fontSize: "15px",
          colors: ["#000000"],
        },
        // formatter: function (val: any) {
        //   return "$"+ val ;
        // },
        formatter: (val: any, opt: any) => {
          // Verificar si es el primer dato de la serie y agregar "$" solo en ese caso
          if (opt.seriesIndex === 0 && opt.dataPointIndex === 0) {
            return this.local_data.unidades_numerador.includes("dolares")
              ? new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(val)
              : val;
          } else {
            return this.local_data.unidades_denominador.includes("dolares") ||
              this.local_data.unidades_indicador.includes("dolares/socios")
              ? new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(val)
              : val;
          }
        },
      },
      colors: ["#8597fc", "#FFAD2C"],
      xaxis: {
        categories: [
          this.local_data.descripcionindicador +
            ` (${this.local_data.resultado_indicador}%)`,
        ],
      },
      yaxis: {
        show: true,
        labels: {
          formatter: function (val: any) {
            return "$" + val;
          },
          style: {
            colors: ["#000000"], // Cambia el color del texto del eje Y
            fontSize: "15px", // Cambia el tamaño del texto del eje Y
          },
        },
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
      return valor; // Puedes retornar el valor original o manejarlo de otra manera según tus necesidades
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
        : null;
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

    if (this.plot_type === 5) {
      this.initializeBarChartOptions();
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
}
