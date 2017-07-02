package org.competition;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.concurrent.ThreadLocalRandom;

/**
 * Created by jmrodriguez on 3/1/17.
 */
public class RifaHelper {

    public static void main(String[] args) throws IOException {

        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        System.out.print("Enter number of groups: ");
        try{
            int grupos = Integer.parseInt(br.readLine());
            String[] rifa = RifaHelper.generarRifa(grupos);
            for (int i = 0; i < rifa.length; i++) {
                System.out.println(rifa[i]);
            }
        }catch(NumberFormatException nfe){
            System.err.println("Invalid Format!");
        }
    }

    public static String[] generarRifa(int cantidadGrupos) {

        int tamanoLlave = RifaHelper.getTamanoLLave(cantidadGrupos);
        int nivelesLlave = (int) (Math.log((double)tamanoLlave) / Math.log((double)2));
        int jugadores = cantidadGrupos * 2;
        int byes  = tamanoLlave - jugadores;
        String[] rifa = new String[tamanoLlave];

        LinkedList<String> primerosDeGrupo = new LinkedList<String>();
        LinkedList<String> segundosDeGrupo = new LinkedList<String>();

        for (int i = 0; i < cantidadGrupos; i++) {
            Character letra = new Character((char) (i + 65));
            primerosDeGrupo.add("1" + letra);
            segundosDeGrupo.add("2" + letra);
        }

        // calcular buckets de primeros y segundos
        int[][] primerosBucket = new int[nivelesLlave - 2][];
        int[] segundosBucket = new int[tamanoLlave / 2];
        // en el bucket de segundos van la posicion 2 y tamanoLlave - 1 porque los 1A y 1B van fijos de primero y ultimo
        // en la llave
        segundosBucket[0] = 2;
        segundosBucket[1] = tamanoLlave - 1;
        int segundosBucketIndex = 2;
        for (int i = 1; i <= nivelesLlave - 2; i++) {
            int[] tempBucketPrimeros = new int[(int)Math.pow(2, i)];
            int pivot = (int) Math.pow(2, nivelesLlave - i);
            for (int j = 0; j < (int) Math.pow(2, i); j = j + 2) {
                int base = pivot * (j + 1);
                tempBucketPrimeros[j] = base;
                tempBucketPrimeros[j + 1] = base + 1;

                segundosBucket[segundosBucketIndex] = base - 1;
                segundosBucketIndex++;
                segundosBucket[segundosBucketIndex] = base + 2;
                segundosBucketIndex++;
            }
            primerosBucket[i - 1] = tempBucketPrimeros;
        }

        // repartir primeros de grupo
        // 1A va en posicion 1
        rifa[0] = primerosDeGrupo.removeFirst();
        if (byes > 0) {
            rifa[1] = "BYE";
            segundosBucket = RifaHelper.eliminarElementoDeBucketPorValor(segundosBucket, 2);
            byes--;
        }
        // 1B va en posicion N (N = tamaNo de llave)
        rifa[tamanoLlave - 1] = primerosDeGrupo.removeFirst();
        if (byes > 0) {
            rifa[tamanoLlave - 2] = "BYE";
            segundosBucket = RifaHelper.eliminarElementoDeBucketPorValor(segundosBucket, tamanoLlave - 1);
            byes--;
        }
        // iterar los buckets de primeros de grupo, separando a los segundos de grupo para que vayan al lado opuesto
        // de la llave
        LinkedList<String> segundosQueVanArriba = new LinkedList<String>();
        // 2B va arriba
        segundosQueVanArriba.add(segundosDeGrupo.get(1));
        LinkedList<String> segundosQueVanAbajo = new LinkedList<String>();
        // 2A va abajo
        segundosQueVanAbajo.add(segundosDeGrupo.get(0));

        // inicio el counter en 2 porque 2A y 2B ya estan
        int counter = 2;

        for (int i = 0; i < primerosBucket.length; i++) {
            // copia del bucket de la cual vamos a ir sacando posiciones aleatoriamente para asignarselas a los ganadores
            // de grupos
            int[] copiaBucket =  Arrays.copyOf(primerosBucket[i], primerosBucket[i].length);
            for (int j = 0; j < primerosBucket[i].length && primerosDeGrupo.size() > 0; j++) {

                String primero = primerosDeGrupo.removeFirst();
                int posicion;
                // si ya solo queda 1 elemento en el bucket, usarlo
                if (copiaBucket.length == 1) {
                    posicion = copiaBucket[0];
                } else {
                    int randomNum = ThreadLocalRandom.current().nextInt(0, copiaBucket.length);
                    // rifar la posicion en la llave
                    posicion = copiaBucket[randomNum];
                }
                // eliminar la posicion del bucket y reducirlo
                copiaBucket = RifaHelper.eliminarElementoDeBucketPorValor(copiaBucket, posicion);

                // agregar a la llave final
                rifa[posicion - 1] = primero;
                // si quedan byes, asignarle uno
                if (byes > 0) {
                    if (posicion % 2 == 0) {
                        rifa[posicion - 2] = "BYE";
                        // remover esta posicion del bucket de 2dos
                        segundosBucket = RifaHelper.eliminarElementoDeBucketPorValor(segundosBucket, posicion - 1);
                    } else {
                        rifa[posicion] = "BYE";
                        // remover esta posicion del bucket de 2dos
                        segundosBucket = RifaHelper.eliminarElementoDeBucketPorValor(segundosBucket, posicion + 1);
                    }
                    byes--;
                }

                if (posicion > (tamanoLlave / 2)) {
                    segundosQueVanArriba.add(segundosDeGrupo.get(counter));
                } else {
                    segundosQueVanAbajo.add(segundosDeGrupo.get(counter));
                }

                counter++;
            }
            // se pasan los elementos que sobren del bucket de primeros al bucket de segundos
            for (int t = 0; t < copiaBucket.length; t++) {
                segundosBucket = RifaHelper.agregarElementoABucketPorValor(segundosBucket, copiaBucket[t]);
            }
        }

        // repartir segundos de grupo
        for (int i = 0; i < cantidadGrupos; i++) {
            String segundo = segundosDeGrupo.removeFirst();
            int posicion;
            // si ya solo queda 1 elemento en el bucket, usarlo
            if (segundosBucket.length == 1) {
                posicion = segundosBucket[0];
            } else {
                boolean posicionViable = false;
                int randomNum = ThreadLocalRandom.current().nextInt(0, segundosBucket.length);
                // rifar la posicion en la llave
                posicion = segundosBucket[randomNum];
                while (!posicionViable) {
                    // ver si la posicion nos sirve de acuerdo a las restricciones
                    if ((posicion <= (tamanoLlave / 2) && (segundosQueVanArriba.contains(segundo) || !RifaHelper.hayPosicionesViablesDisponibles(segundosBucket, tamanoLlave, true))) ||
                        (posicion > (tamanoLlave / 2) && (segundosQueVanAbajo.contains(segundo) || !RifaHelper.hayPosicionesViablesDisponibles(segundosBucket, tamanoLlave, false)))) {
                        posicionViable = true;
                    } else {
                        randomNum = ThreadLocalRandom.current().nextInt(0, segundosBucket.length);
                        posicion = segundosBucket[randomNum];
                    }
                }

                // eliminar la posicion del bucket y reducirlo
                segundosBucket = RifaHelper.eliminarElementoDeBucketPorValor(segundosBucket, posicion);
            }

            // agregar a la llave final
            rifa[posicion - 1] = segundo;

            // si quedan byes, asignarle uno
            if (byes > 0) {
                if (posicion % 2 == 0) {
                    if (rifa[posicion - 2] == null) {
                        rifa[posicion - 2] = "BYE";
                        byes--;
                        segundosBucket = RifaHelper.eliminarElementoDeBucketPorValor(segundosBucket, posicion - 1);
                    }
                } else {
                    if (rifa[posicion] == null) {
                        rifa[posicion] = "BYE";
                        byes--;
                        segundosBucket = RifaHelper.eliminarElementoDeBucketPorValor(segundosBucket, posicion + 1);
                    }
                }
            }
        }

        return rifa;
    }

    /**
     * Calcula el tamano de la llave dependiendo del numero de grupos
     * @param cantidadGrupos la cantidad de grupos
     * @return el tamaNo de la llave
     */
    public static int getTamanoLLave(int cantidadGrupos) {
        int i = 1;
        double tamanoLlave = Math.pow(2, i);
        while(tamanoLlave < cantidadGrupos * 2) {
            i++;
            tamanoLlave = Math.pow(2, i);
        }
        return (int)tamanoLlave;
    }

    /**
     * Retorna una copia del arreglo original, sin el elemento con el valor especificado
     * @param arregloOriginal
     * @param valor
     * @return el arreglo reducido
     */
    public static int[] eliminarElementoDeBucketPorValor(int[] arregloOriginal, int valor) {
        int[] tempArray = new int[arregloOriginal.length - 1];
        int j = 0;
        for (int i = 0; i < arregloOriginal.length; i++) {
            if (arregloOriginal[i] != valor) {
                tempArray[j] = arregloOriginal[i];
                j++;
            }
        }

        return tempArray;
    }

    /**
     * Retorna una copia del arreglo original, mas el elemento con el valor especificado
     * @param arregloOriginal
     * @param valor
     * @return el arreglo extendido
     */
    public static int[] agregarElementoABucketPorValor(int[] arregloOriginal, int valor) {
        int[] tempArray = new int[arregloOriginal.length + 1];
        for (int i = 0; i < arregloOriginal.length; i++) {
            tempArray[i] = arregloOriginal[i];
        }
        tempArray[tempArray.length - 1] = valor;

        return tempArray;
    }

    /**
     * Revisa el bucket buscando si hay posiciones disponibles en la mitad superior o inferior, dependiendo del tamano de la llave y
     * del parametro enviado
     * @param bucket el bucket a revisar
     * @param tamanoLlave el tamano de llave para poder saber cuales posiciones son de la mitad superior o inferior
     * @param posicionesDeArriba si estamos buscando posiciones de arriba de la llave o no
     */
    public static boolean hayPosicionesViablesDisponibles(int[] bucket, int tamanoLlave, boolean posicionesDeArriba) {
        int mitadLlave = tamanoLlave / 2;

        boolean hayDisponibles = false;
        for (int i = 0; i < bucket.length; i++) {
            if (posicionesDeArriba && bucket[i] > mitadLlave || !posicionesDeArriba && bucket[i] <= mitadLlave) {
                return true;
            }
        }

        return hayDisponibles;
    }
}
