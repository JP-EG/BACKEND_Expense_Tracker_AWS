import { Construct } from 'constructs';
import {
    AttributeType,
    BillingMode,
    ProjectionType,
    Table,
} from 'aws-cdk-lib/aws-dynamodb';
import { RemovalPolicy } from 'aws-cdk-lib';

export class ExpenseTable extends Construct {
    public readonly table: Table;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.table = new Table(this, 'ExpenseTable', {
            tableName: 'ExpenseTable',
            partitionKey: { name: 'userId', type: AttributeType.STRING },
            sortKey: { name: 'expenseId', type: AttributeType.STRING },
            billingMode: BillingMode.PAY_PER_REQUEST,
            deletionProtection: false,
            pointInTimeRecoverySpecification: {
                pointInTimeRecoveryEnabled: false
            },
            removalPolicy: RemovalPolicy.DESTROY,
        });

        this.addGlobalSecondaryIndexes();
    }

    private addGlobalSecondaryIndexes() {
        this.table.addGlobalSecondaryIndex({
            indexName: 'expensesByCategory-index',
            partitionKey: { name: 'userId', type: AttributeType.STRING },
            sortKey: { name: 'category', type: AttributeType.STRING },
            projectionType: ProjectionType.ALL,
        });

        this.table.addGlobalSecondaryIndex({
            indexName: 'expensesByDate-index',
            partitionKey: { name: 'userId', type: AttributeType.STRING },
            sortKey: { name: 'date', type: AttributeType.STRING },
            projectionType: ProjectionType.ALL,
        });

        this.table.addGlobalSecondaryIndex({
            indexName: 'userId-index',
            partitionKey: { name: 'userId', type: AttributeType.STRING },
            projectionType: ProjectionType.ALL,
        });

        this.table.addGlobalSecondaryIndex({
            indexName: 'expenseId-index',
            partitionKey: { name: 'expenseId', type: AttributeType.STRING },
            projectionType: ProjectionType.ALL,
        });

        this.table.addGlobalSecondaryIndex({
            indexName: 'userId-expenseId-index',
            partitionKey: { name: 'userId', type: AttributeType.STRING },
            sortKey: { name: 'expenseId', type: AttributeType.STRING },
            projectionType: ProjectionType.ALL,
        });
    }
}
