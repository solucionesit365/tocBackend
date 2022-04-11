export class GlobalClase {
    private stopNecesario: boolean;

    getStopNecesario(): boolean {
        return this.stopNecesario;
    }

    setStopNecesario(valor: boolean): void {
        this.stopNecesario = valor;
    }
}

export const globalInstance = new GlobalClase();