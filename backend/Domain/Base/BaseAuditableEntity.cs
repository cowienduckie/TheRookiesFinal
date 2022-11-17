namespace Domain.Base;

public abstract class AuditableEntity<TKey> : BaseEntity<TKey>, IAuditEntity, IDeleteEntity
{
    public DateTime Created { get; set; }
    public string? CreatedBy { get; set; }
    public DateTime? LastModified { get; set; }
    public string? LastModifiedBy { get; set; }
    public bool IsDeleted { get; set; }
}

public interface IAuditEntity
{
    DateTime Created { get; set; }
    string? CreatedBy { get; set; }
    DateTime? LastModified { get; set; }
    string? LastModifiedBy { get; set; }
}

public interface IDeleteEntity
{
    bool IsDeleted { get; set; }
}