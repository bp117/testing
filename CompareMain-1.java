/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Compare;

import java.util.ArrayList;
import java.util.List;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.ZonedDateTime;

class Account {

    private BigDecimal txnAmt;
    private ZonedDateTime postDate;
    private long seqNo;
    private String txnDescription;

    public Account(long seqNo, String txnDescription, BigDecimal txAmt, ZonedDateTime postDate) {
        this.postDate = postDate;
        this.seqNo = seqNo;
        this.txnDescription = txnDescription;
        this.txnAmt = txnAmt;
    }

    public BigDecimal getTxnAmt() {
        return txnAmt;
    }

    public void setTxnAmt(BigDecimal txnAmt) {
        this.txnAmt = txnAmt;
    }

    public ZonedDateTime getPostDate() {
        return postDate;
    }

    public void setPostDate(ZonedDateTime postDate) {
        this.postDate = postDate;
    }

    public long getSeqNo() {
        return seqNo;
    }

    public void setSeqNo(long seqNo) {
        this.seqNo = seqNo;
    }

    public String getTxnDescription() {
        return txnDescription;
    }

    public void setTxnDescription(String txnDescription) {
        this.txnDescription = txnDescription;
    }

    @Override
    public String toString() {
        return "#AMOUNT: " + txnAmt + " --> #DESC: " + txnDescription + "  -->  #SEQ: " + seqNo + "  -->  #DATE: " + postDate.toString();
    }

}

class CompareUtil {

    public static List<List<Account>> compareAccounts(List<Account> list1, List<Account> list2) {
        List<Account> balancedAccounts = new ArrayList<>();
        List<Account> unBalancedAccounts = new ArrayList<>();
        List<List<Account>> result = new ArrayList<>();

//        List<Account> biggerList = list1.size()>list2.size()? list1 : list2;
//        List<Account> smallerList = list1.size()<=list2.size()? list1 : list2;
        for (int i = list1.size() - 1; i >= 0; i--) {
            for (int j = list2.size() - 1; j >= 0; j--) {
                Account acc1 = list1.get(i);
                Account acc2 = list2.get(j);

                if (acc1.getSeqNo() == acc2.getSeqNo() && acc1.getPostDate().equals(acc2.getPostDate())) {
                    if (acc1.getTxnAmt() == acc2.getTxnAmt()) {
                        balancedAccounts.add(acc1);
                        balancedAccounts.add(acc2);
                    } else {
                        unBalancedAccounts.add(acc1);
                        unBalancedAccounts.add(acc2);
                    }
                    list1.remove(i);
                    list2.remove(j);

                    // Checking index of non matching char for both txtDesc
                    int index = 0;
                    String desc1 = acc1.getTxnDescription(), desc2 = acc2.getTxnDescription();
                    int smallerLenIndex = desc1.length() < desc2.length() ? desc1.length() : desc2.length();
                    if (!desc1.equals(desc2)) {
                        while (index < smallerLenIndex && acc1.getTxnDescription().charAt(index) == acc2.getTxnDescription().charAt(index)) {
                            index++;
                        }
                        System.out.println("FIRST NON MATCHING INDEX " + index);
                    }

                    break;
                }
            }

        }

        result.add(balancedAccounts);
        result.add(unBalancedAccounts);

        return result;
    }
}

/**
 *
 * @author nkemcels
 */
public class CompareMain {

    public static void main(String[] args) {
        List<Account> firstList = new ArrayList<>();
        firstList.add(new Account(1, "first account1", new BigDecimal(200), ZonedDateTime.parse("2010-04-06T16:01:00.000+03:00")));
        firstList.add(new Account(2, "account2", new BigDecimal(500), ZonedDateTime.parse("2018-04-06T16:01:00.000+03:00")));
        firstList.add(new Account(3, "third account", new BigDecimal(300), ZonedDateTime.parse("2018-04-06T16:01:00.000+03:00")));
        firstList.add(new Account(4, "fourth account", new BigDecimal(900), ZonedDateTime.parse("2018-04-06T16:01:00.000+03:00")));

        List<Account> secondList = new ArrayList<>();
        secondList.add(new Account(1, "first account", new BigDecimal(200), ZonedDateTime.parse("2018-04-06T16:01:00.000+03:00")));
        secondList.add(new Account(2, "second account", new BigDecimal(200), ZonedDateTime.parse("2018-04-06T16:01:00.000+03:00")));
        secondList.add(new Account(3, "third account", new BigDecimal(300), ZonedDateTime.parse("2018-04-06T16:01:00.000+03:00")));
        secondList.add(new Account(4, "fourth account", new BigDecimal(700), ZonedDateTime.parse("2018-04-06T16:01:00.000+03:00")));
        secondList.add(new Account(5, "fifth account", new BigDecimal(100), ZonedDateTime.parse("2018-04-06T16:01:00.000+03:00")));
        secondList.add(new Account(6, "sixth account", new BigDecimal(100), ZonedDateTime.parse("2018-04-06T16:01:00.000+03:00")));

        List<List<Account>> result = CompareUtil.compareAccounts(firstList, secondList);
        System.out.println("RESULT");
        System.out.println(result);
        System.out.println("-----\n\nfIRST LIST");
        System.out.println(firstList);
        System.out.println("-----\n\nSECOND LIST");
        System.out.println(secondList);
    }
}
