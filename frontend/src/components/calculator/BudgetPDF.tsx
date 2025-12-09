import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 10,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderBottomWidth: 2,
    borderBottomColor: "#8B709D",
    paddingBottom: 15,
    marginBottom: 25,
  },
  headerLeft: {
    flexDirection: "column",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 700,
    color: "#8B709D",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 10,
    color: "#6B7280",
    fontWeight: 500,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  headerDate: {
    fontSize: 10,
    fontWeight: 700,
    color: "#1F2937",
    marginBottom: 2,
  },
  headerRef: {
    fontSize: 8,
    color: "#6B7280",
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: "#8B709D",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },
  infoItem: {
    width: "48%",
    marginBottom: 10,
  },
  infoItemFull: {
    width: "100%",
    marginTop: 8,
  },
  infoLabel: {
    fontSize: 8,
    color: "#6B7280",
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 10,
    fontWeight: 700,
    color: "#000000",
  },
  infoValueNormal: {
    fontSize: 10,
    fontWeight: 400,
    color: "#000000",
  },
  table: {
    width: "100%",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  tableHeaderCell: {
    fontSize: 9,
    fontWeight: 700,
    color: "#4B5563",
  },
  tableCell: {
    fontSize: 9,
    color: "#000000",
  },
  tableCellBold: {
    fontSize: 9,
    fontWeight: 700,
    color: "#000000",
  },
  tableCellGray: {
    fontSize: 8,
    color: "#6B7280",
  },
  col1: {
    width: "35%",
  },
  col2: {
    width: "30%",
  },
  col3: {
    width: "17.5%",
    textAlign: "right",
  },
  col4: {
    width: "17.5%",
    textAlign: "right",
  },
  colExtra1: {
    width: "40%",
  },
  colExtra2: {
    width: "20%",
  },
  colExtra3: {
    width: "20%",
    textAlign: "right",
  },
  colExtra4: {
    width: "20%",
    textAlign: "right",
  },
  subtotalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  subtotalText: {
    fontSize: 10,
    fontWeight: 700,
    color: "#374151",
  },
  emptyMessage: {
    fontSize: 8,
    color: "#9CA3AF",
    fontStyle: "italic",
    marginTop: 8,
  },
  observationsBox: {
    marginTop: 15,
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  observationsLabel: {
    fontSize: 8,
    color: "#6B7280",
    fontWeight: 700,
    marginBottom: 4,
  },
  observationsText: {
    fontSize: 9,
    color: "#374151",
    fontStyle: "italic",
  },
  totalsSection: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: "#1F2937",
    alignItems: "flex-end",
  },
  totalsBox: {
    width: 250,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 15,
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 700,
    color: "#8B709D",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 700,
    color: "#8B709D",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 8,
    color: "#9CA3AF",
  },
});

interface MaterialVariant {
  size: string;
  quantity: number;
}

interface Material {
  productoId?: number;
  name: string;
  unitPrice: number;
  variants: MaterialVariant[];
}

interface Extra {
  name: string;
  quantity: number;
  amount: number;
}

interface BudgetPDFProps {
  formData: {
    id?: number;
    title?: string;
    clientName?: string;
    clientEmail?: string;
    clientPhone?: string;
    deliveryDate?: string;
    observations?: string;
  };
  materials: Material[];
  extras: Extra[];
  totalMaterialsCost: number;
  grandTotal: number;
}

const BudgetPDF: React.FC<BudgetPDFProps> = ({
  formData,
  materials,
  extras,
  totalMaterialsCost,
  grandTotal,
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>KONFEX</Text>
            <Text style={styles.headerSubtitle}>Presupuesto Oficial</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerDate}>
              Fecha: {new Date().toLocaleDateString("es-AR")}
            </Text>
            <Text style={styles.headerRef}>
              ID Ref: {formData.id || "000025"}
            </Text>
          </View>
        </View>

        {/* Client Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Información del Cliente</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Título Presupuesto</Text>
              <Text style={styles.infoValue}>{formData.title || "-"}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Cliente</Text>
              <Text style={styles.infoValue}>{formData.clientName || "-"}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValueNormal}>
                {formData.clientEmail || "-"}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Teléfono</Text>
              <Text style={styles.infoValueNormal}>
                {formData.clientPhone || "-"}
              </Text>
            </View>
            <View style={styles.infoItemFull}>
              <Text style={styles.infoLabel}>Fecha Entrega Estimada</Text>
              <Text style={styles.infoValueNormal}>
                {formData.deliveryDate || "-"}
              </Text>
            </View>
          </View>
        </View>

        {/* Materials and Products */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Materiales y Prendas</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.col1]}>Ítem</Text>
              <Text style={[styles.tableHeaderCell, styles.col2]}>
                Variantes
              </Text>
              <Text style={[styles.tableHeaderCell, styles.col3]}>
                Precio U.
              </Text>
              <Text style={[styles.tableHeaderCell, styles.col4]}>
                Subtotal
              </Text>
            </View>
            {materials.map((m: Material, i: number) => {
              const qty =
                m.variants?.reduce(
                  (acc: number, v: MaterialVariant) => acc + v.quantity,
                  0
                ) || 0;
              return (
                <View key={i} style={styles.tableRow}>
                  <Text style={[styles.tableCellBold, styles.col1]}>
                    {m.name}
                  </Text>
                  <Text style={[styles.tableCellGray, styles.col2]}>
                    {m.variants
                      ?.map(
                        (v: MaterialVariant) => `${v.size} (${v.quantity}u)`
                      )
                      .join(", ")}
                  </Text>
                  <Text style={[styles.tableCell, styles.col3]}>
                    $ {m.unitPrice?.toLocaleString("es-AR")}
                  </Text>
                  <Text style={[styles.tableCellBold, styles.col4]}>
                    $ {(qty * m.unitPrice).toLocaleString("es-AR")}
                  </Text>
                </View>
              );
            })}
          </View>
          {materials.length === 0 && (
            <Text style={styles.emptyMessage}>Sin materiales registrados.</Text>
          )}
          <View style={styles.subtotalRow}>
            <Text style={styles.subtotalText}>
              Subtotal Materiales: ${" "}
              {totalMaterialsCost.toLocaleString("es-AR")}
            </Text>
          </View>
        </View>

        {/* Additional Costs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Costos Adicionales</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.colExtra1]}>
                Concepto
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colExtra2]}>
                Cant.
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colExtra3]}>
                Monto U.
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colExtra4]}>
                Subtotal
              </Text>
            </View>
            {extras.map((e: Extra, i: number) => (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.tableCellBold, styles.colExtra1]}>
                  {e.name}
                </Text>
                <Text style={[styles.tableCellGray, styles.colExtra2]}>
                  {e.quantity}
                </Text>
                <Text style={[styles.tableCell, styles.colExtra3]}>
                  $ {e.amount?.toLocaleString("es-AR")}
                </Text>
                <Text style={[styles.tableCellBold, styles.colExtra4]}>
                  $ {(e.quantity * e.amount).toLocaleString("es-AR")}
                </Text>
              </View>
            ))}
          </View>
          {extras.length === 0 && (
            <Text style={styles.emptyMessage}>Sin costos adicionales.</Text>
          )}

          {formData.observations && (
            <View style={styles.observationsBox}>
              <Text style={styles.observationsLabel}>Observaciones:</Text>
              <Text style={styles.observationsText}>
                {formData.observations}
              </Text>
            </View>
          )}
        </View>

        {/* Final Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TOTAL:</Text>
              <Text style={styles.totalValue}>
                $ {grandTotal.toLocaleString("es-AR")}
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Generado automáticamente por KONFEX App
        </Text>
      </Page>
    </Document>
  );
};

export default BudgetPDF;
