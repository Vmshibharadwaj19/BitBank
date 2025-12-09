package com.emp.ems.ServiceImpl;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.stereotype.Service;

import com.emp.ems.Service.StatementService;
import com.emp.ems.entities.Account;
import com.emp.ems.entities.Transaction;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

@Service
public class StatementServiceImpl implements StatementService {

    @Override
    public byte[] generateStatementPdf(Account account, List<Transaction> transactions) {
        try {
            Document document = new Document(PageSize.A4);
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter.getInstance(document, baos);
            
            document.open();

            // Title-Font is a class that is in built in ja 
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Color.black);
            Paragraph title = new Paragraph("BitBank - Account Statement", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);
            
            // Bank Header-Paragraph is a built in class
            Font bankFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, Color.black);
            Paragraph bankHeader = new Paragraph("BitBank", bankFont);
            bankHeader.setAlignment(Element.ALIGN_CENTER);
            bankHeader.setSpacingAfter(10);
            document.add(bankHeader);

            // Account Information-fetching through the parameter used in another
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12,Color.black);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 10,Color.black);
            
            document.add(new Paragraph("Account Number: " + account.getAccountNumber(), normalFont));
            document.add(new Paragraph("Account Type: " + (account.getType() != null ? account.getType().toString() : "N/A"), normalFont));
            if (account.getCustomer() != null) {
                document.add(new Paragraph("Customer Name: " + account.getCustomer().getFullName(), normalFont));
            }
            document.add(new Paragraph("Current Balance: ₹" + String.format("%.2f", account.getBalance()), headerFont));
            document.add(new Paragraph("\n", normalFont));

            // Transactions Table
            if (transactions != null && !transactions.isEmpty()) {
                PdfPTable table = new PdfPTable(6);
                table.setWidthPercentage(100);
                table.setSpacingBefore(10);

                // Table Header - pdf writer and o
                String[] headers = {"Date", "Type", "Description", "Amount", "Status", "Account"};
                Font tableHeaderFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10);
                
                for (String header : headers) {
                    PdfPCell cell = new PdfPCell(new Phrase(header, tableHeaderFont));
                    cell.setBackgroundColor(Color.black);
                    cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                    cell.setPadding(8);
                    table.addCell(cell);
                }

                // Table Data
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm");
                Font tableFont = FontFactory.getFont(FontFactory.HELVETICA, 9, Color.black);
                
                for (Transaction txn : transactions) {
                    // Date
                    String dateStr = txn.getCreatedAt() != null 
                        ? txn.getCreatedAt().format(formatter) 
                        : "N/A";
                    table.addCell(new PdfPCell(new Phrase(dateStr, tableFont)));

                    // Type
                    String typeStr = txn.getType() != null ? txn.getType().toString() : "N/A";
                    table.addCell(new PdfPCell(new Phrase(typeStr, tableFont)));

                    // Description
                    String desc = txn.getDescription() != null ? txn.getDescription() : "";
                    table.addCell(new PdfPCell(new Phrase(desc, tableFont)));

                    // Amount
                    PdfPCell amountCell = new PdfPCell(new Phrase("₹" + String.format("%.2f", txn.getAmount()), tableFont));
                    amountCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                    table.addCell(amountCell);

                    // Status
                    String status = txn.getStatus() != null ? txn.getStatus() : "N/A";
                    PdfPCell statusCell = new PdfPCell(new Phrase(status, tableFont));
                    statusCell.setBackgroundColor(status.equals("SUCCESS") 
                        ? new Color(200, 255, 200) 
                        : new Color(255, 200, 200));
                    table.addCell(statusCell);

                    // Account Info
                    String accountInfo = "";
                    if (txn.getFromAccount() != null && txn.getToAccount() != null) {
                        accountInfo = txn.getFromAccount().getAccountNumber() + " → " + txn.getToAccount().getAccountNumber();
                    } else if (txn.getFromAccount() != null) {
                        accountInfo = "From: " + txn.getFromAccount().getAccountNumber();
                    } else if (txn.getToAccount() != null) {
                        accountInfo = "To: " + txn.getToAccount().getAccountNumber();
                    }
                    table.addCell(new PdfPCell(new Phrase(accountInfo, tableFont)));
                }

                document.add(table);
            } else {
                document.add(new Paragraph("No transactions found for this account.", normalFont));
            }

            // Summary
            document.add(new Paragraph("\n", normalFont));
            document.add(new Paragraph("Total Transactions: " + (transactions != null ? transactions.size() : 0), headerFont));
            document.add(new Paragraph("Generated on: " + java.time.LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss")), normalFont));

            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            e.printStackTrace();
            // Fallback to simple text if PDF generation fails Generation using the classes
            StringBuilder sb = new StringBuilder();
            sb.append("BitBank - Account Statement\n");
            sb.append("Account Number: ").append(account.getAccountNumber()).append("\n");
            sb.append("Balance: ₹").append(String.format("%.2f", account.getBalance())).append("\n\n");
            sb.append("Transactions:\n");
            if (transactions != null) {
                for (Transaction t : transactions) {
                    sb.append(t.getType()).append(" | ₹").append(String.format("%.2f", t.getAmount()))
                      .append(" | ").append(t.getDescription()).append("\n");
                }
            }
            return sb.toString().getBytes();
        }
    }
}
